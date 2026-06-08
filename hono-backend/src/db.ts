import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hotelex',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
})

// No-op kept so index.ts import doesn't break
export function initDatabase() {
  console.log('📊 Using MySQL database via XAMPP')
}

export const userQueries = {
  async create(name: string, email: string, passwordHash: string, role: string, createdAt: string) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [result] = await conn.execute(
        'INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, ?)',
        [email, passwordHash, role, createdAt]
      )
      const userId = (result as any).insertId
      await conn.execute(
        'INSERT INTO user_profiles (user_id, display_name, created_at) VALUES (?, ?, ?)',
        [userId, name, createdAt]
      )
      await conn.commit()
      return result
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  },

  async findByEmail(email: string) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.password_hash, u.role, u.created_at,
              up.display_name AS name, up.phone
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.email = ? AND u.deleted_at IS NULL`,
      [email]
    )
    return (rows as any[])[0] ?? null
  },

  async findById(id: number) {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.role, u.created_at,
              up.display_name AS name, up.phone
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.id = ? AND u.deleted_at IS NULL`,
      [id]
    )
    return (rows as any[])[0] ?? null
  },

  async softDelete(id: number) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.execute(
        'UPDATE users SET deleted_at = NOW() WHERE id = ?',
        [id]
      )
      await conn.execute('DELETE FROM sessions WHERE user_id = ?', [id])
      await conn.execute(
        'UPDATE hotels SET deleted_at = NOW() WHERE created_by = ? AND deleted_at IS NULL',
        [id]
      )
      await conn.commit()
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  }
}

export const sessionQueries = {
  async create(token: string, userId: number, expiresAt: string, createdAt: string) {
    const [result] = await pool.execute(
      'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)',
      [token, userId, expiresAt, createdAt]
    )
    return result
  },

  async findByToken(token: string) {
    const [rows] = await pool.execute(
      'SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()',
      [token]
    )
    return (rows as any[])[0] ?? null
  },

  async deleteByToken(token: string) {
    const [result] = await pool.execute(
      'DELETE FROM sessions WHERE token = ?',
      [token]
    )
    return result
  },

  async deleteExpired() {
    const [result] = await pool.execute(
      'DELETE FROM sessions WHERE expires_at <= NOW()'
    )
    return result
  }
}

export const hotelQueries = {
  async findAll(filters: {
    city?: string
    minPrice?: string
    maxPrice?: string
    guests?: string
    checkIn?: string
    checkOut?: string
  } = {}) {
    // When both dates are provided, only include rooms that have no
    // confirmed booking overlapping the requested period.
    // Two bookings overlap when: check_in < requested_out AND check_out > requested_in
    const dateJoin = (filters.checkIn && filters.checkOut)
      ? `AND r.id NOT IN (
           SELECT b.room_id FROM bookings b
           WHERE b.status = 'pending' OR b.status = 'confirmed'
             AND b.check_in  < ?
             AND b.check_out > ?
         )`
      : ''

    let sql = `
      SELECT h.*,
        MIN(r.price_per_night) AS min_price,
        MAX(r.capacity)        AS max_capacity,
        (SELECT GROUP_CONCAT(DISTINCT a.name ORDER BY a.id SEPARATOR ',')
         FROM room_amenities ra
         JOIN rooms r2 ON r2.id = ra.room_id AND r2.hotel_id = h.id AND r2.deleted_at IS NULL
         JOIN amenities a ON a.id = ra.amenity_id
        ) AS amenities
      FROM hotels h
      LEFT JOIN rooms r ON r.hotel_id = h.id AND r.deleted_at IS NULL ${dateJoin}
      WHERE h.deleted_at IS NULL AND h.status = 'approved'
    `
    const params: any[] = []
    const having: string[] = []
    const havingParams: any[] = []

    if (filters.checkIn && filters.checkOut) {
      params.push(filters.checkOut, filters.checkIn)
    }

    if (filters.city) {
      sql += ` AND h.city LIKE ?`
      params.push(`%${filters.city}%`)
    }

    sql += ` GROUP BY h.id`

    if (filters.minPrice) {
      having.push(`min_price >= ?`)
      havingParams.push(Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      having.push(`min_price <= ?`)
      havingParams.push(Number(filters.maxPrice))
    }
    if (filters.guests) {
      having.push(`max_capacity >= ?`)
      havingParams.push(Number(filters.guests))
    }
    if (having.length) {
      sql += ` HAVING ` + having.join(' AND ')
    }

    sql += ` ORDER BY h.name`

    const [rows] = await pool.execute(sql, [...params, ...havingParams])
    return rows as any[]
  },

  async findById(id: number) {
    const [rows] = await pool.execute(
      'SELECT * FROM hotels WHERE id = ? AND deleted_at IS NULL',
      [id]
    )
    return (rows as any[])[0] ?? null
  },

  // Full public detail: hotel + hotel-level amenities + activities
  // Rooms are fetched separately via roomQueries.findByHotel
  async findByIdFull(id: number) {
    const [hotelRows] = await pool.execute(
      'SELECT * FROM hotels WHERE id = ? AND deleted_at IS NULL AND status = \'approved\'',
      [id]
    )
    const hotel = (hotelRows as any[])[0] ?? null
    if (!hotel) return null

    const [amenities] = await pool.execute(
      `SELECT a.id, a.name FROM hotel_amenities ha
       JOIN amenities a ON a.id = ha.amenity_id
       WHERE ha.hotel_id = ? ORDER BY a.name`,
      [id]
    )

    const [activities] = await pool.execute(
      `SELECT a.id, a.name, a.icon FROM hotel_activities ha
       JOIN activities a ON a.id = ha.activity_id
       WHERE ha.hotel_id = ? ORDER BY a.name`,
      [id]
    )

    const [images] = await pool.execute(
      `SELECT hi.id AS hotel_image_id, f.storage_path, f.original_name
       FROM hotel_images hi
       JOIN files f ON f.id = hi.file_id
       WHERE hi.hotel_id = ? ORDER BY hi.sort_order, hi.created_at`,
      [id]
    )

    return { ...hotel, amenities, activities, images }
  },

  // Booking date ranges for the next 60 days — used to render the calendar
  async getBookedDateRanges(hotelId: number) {
    const [rows] = await pool.execute(
      `SELECT DATE_FORMAT(b.check_in, '%Y-%m-%d')  AS checkIn,
              DATE_FORMAT(b.check_out, '%Y-%m-%d') AS checkOut
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       WHERE r.hotel_id = ?
         AND b.status = 'confirmed'
         AND b.check_out >= CURDATE()
         AND b.check_in  < DATE_ADD(CURDATE(), INTERVAL 60 DAY)
       ORDER BY b.check_in`,
      [hotelId]
    )
    return rows as any[]
  }
}

export const bookingQueries = {
  async create(userId: number, roomId: number, checkIn: string, checkOut: string, guests: number, note: string) {
    const [result] = await pool.execute(
      'INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, status, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [userId, roomId, checkIn, checkOut, guests, 'pending', note || null]
    )
    return result
  },

  async findByUser(userId: number) {
    const [rows] = await pool.execute(
      `SELECT b.*, r.name AS room_name, r.price_per_night,
              h.name AS hotel_name, h.city AS hotel_city,
              DATEDIFF(b.check_out, b.check_in) AS nights
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = r.hotel_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    )
    return rows as any[]
  },

  async findByHotel(hotelId: number) {
    const [rows] = await pool.execute(
      `SELECT b.*, r.name AS room_name, r.price_per_night,
              h.name AS hotel_name, h.city AS hotel_city,
              u.email AS user_email, up.display_name AS user_name,
              DATEDIFF(b.check_out, b.check_in) AS nights
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = r.hotel_id
       JOIN users u ON u.id = b.user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE h.id = ?
       ORDER BY b.created_at DESC`,
      [hotelId]
    )
    return rows as any[]
  },

  async accept(id: number, ownerId: number) {
    const [result] = await pool.execute(
      `UPDATE bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = r.hotel_id
       SET b.status = 'confirmed'
       WHERE b.id = ? AND h.created_by = ? AND b.status = 'pending'`,
      [id, ownerId]
    )
    return result
  },

  async reject(id: number, ownerId: number) {
    const [result] = await pool.execute(
      `UPDATE bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = r.hotel_id
       SET b.status = 'rejected'
       WHERE b.id = ? AND h.created_by = ? AND b.status = 'pending'`,
      [id, ownerId]
    )
    return result
  },

  async findById(id: number) {
    const [rows] = await pool.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    )
    return (rows as any[])[0] ?? null
  },

  async cancel(id: number, userId: number) {
    const [result] = await pool.execute(
      "UPDATE bookings SET status = 'cancelled', cancelled_at = NOW() WHERE id = ? AND user_id = ? AND status != 'cancelled'",
      [id, userId]
    )
    return result
  },
}

export const adminQueries = {
  async getStats() {
    const [[hotels]] = await pool.execute('SELECT COUNT(*) AS count FROM hotels WHERE deleted_at IS NULL') as any
    const [[users]] = await pool.execute('SELECT COUNT(*) AS count FROM users WHERE deleted_at IS NULL') as any
    const [[bookings]] = await pool.execute('SELECT COUNT(*) AS count FROM bookings') as any
    return {
      hotels: hotels.count,
      users: users.count,
      bookings: bookings.count,
    }
  },

  async getAllUsers() {
    const [rows] = await pool.execute(
      `SELECT u.id, u.email, u.role, u.created_at,
              up.display_name AS name
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.deleted_at IS NULL
       ORDER BY u.created_at DESC`
    )
    return rows as any[]
  },

  async getAllBookings() {
    const [rows] = await pool.execute(
      `SELECT b.*, u.email AS user_email, up.display_name AS user_name,
              r.name AS room_name, r.price_per_night,
              h.name AS hotel_name, h.city AS hotel_city
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       LEFT JOIN user_profiles up ON up.user_id = u.id
       JOIN rooms r ON r.id = b.room_id
       JOIN hotels h ON h.id = r.hotel_id
       ORDER BY b.created_at DESC`
    )
    return rows as any[]
  },

  // Admin-created hotels skip the approval queue and go live immediately.
  async createHotel(name: string, city: string, address: string, description: string, createdBy: number) {
    const [result] = await pool.execute(
      "INSERT INTO hotels (name, city, address, description, status, created_by, created_at) VALUES (?, ?, ?, ?, 'approved', ?, NOW())",
      [name, city, address, description, createdBy]
    )
    return result
  },

  async updateHotel(id: number, name: string, city: string, address: string, description: string) {
    const [result] = await pool.execute(
      'UPDATE hotels SET name = ?, city = ?, address = ?, description = ? WHERE id = ? AND deleted_at IS NULL',
      [name, city, address, description, id]
    )
    return result
  },

  async deleteHotel(id: number) {
    const [result] = await pool.execute(
      'UPDATE hotels SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    )
    return result
  },

  async updateUserRole(userId: number, role: string) {
    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ? AND deleted_at IS NULL',
      [role, userId]
    )
    return result
  },

  async getPendingHotels() {
    const [rows] = await pool.execute(
      `SELECT h.*, up.display_name AS owner_name, u.email AS owner_email
       FROM hotels h
       JOIN users u ON u.id = h.created_by
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE h.deleted_at IS NULL AND h.status = 'pending'
       ORDER BY h.created_at ASC`
    )
    return rows as any[]
  },

  async approveHotel(id: number) {
    const [result] = await pool.execute(
      "UPDATE hotels SET status = 'approved', rejection_reason = NULL WHERE id = ? AND deleted_at IS NULL",
      [id]
    )
    return result
  },

  async rejectHotel(id: number, reason: string) {
    const [result] = await pool.execute(
      "UPDATE hotels SET status = 'rejected', rejection_reason = ? WHERE id = ? AND deleted_at IS NULL",
      [reason, id]
    )
    return result
  },

  async getHotelFull(id: number) {
    const [hotelRows] = await pool.execute(
      `SELECT h.*, up.display_name AS owner_name, u.email AS owner_email
       FROM hotels h
       JOIN users u ON u.id = h.created_by
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE h.id = ? AND h.deleted_at IS NULL`,
      [id]
    )
    const hotel = (hotelRows as any[])[0] ?? null
    if (!hotel) return null

    const [rooms] = await pool.execute(
      `SELECT r.*, rt.name AS type_name
       FROM rooms r
       JOIN room_types rt ON rt.id = r.room_type_id
       WHERE r.hotel_id = ? AND r.deleted_at IS NULL
       ORDER BY r.price_per_night`,
      [id]
    )

    const [amenities] = await pool.execute(
      `SELECT a.id, a.name FROM hotel_amenities ha
       JOIN amenities a ON a.id = ha.amenity_id
       WHERE ha.hotel_id = ? ORDER BY a.name`,
      [id]
    )

    const [images] = await pool.execute(
      `SELECT hi.id AS hotel_image_id, hi.sort_order, f.id AS file_id, f.original_name, f.storage_path
       FROM hotel_images hi
       JOIN files f ON f.id = hi.file_id
       WHERE hi.hotel_id = ?
       ORDER BY hi.sort_order, hi.created_at`,
      [id]
    )

    const [activities] = await pool.execute(
      `SELECT a.id, a.name, a.icon FROM hotel_activities ha
       JOIN activities a ON a.id = ha.activity_id
       WHERE ha.hotel_id = ? ORDER BY a.name`,
      [id]
    )

    return { ...hotel, rooms, amenities, activities, images }
  },
}

export const amenityQueries = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM amenities ORDER BY name')
    return rows as any[]
  }
}

export const activityQueries = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM activities ORDER BY name')
    return rows as any[]
  },

  async findByHotel(hotelId: number) {
    const [rows] = await pool.execute(
      `SELECT a.id, a.name, a.icon
       FROM hotel_activities ha
       JOIN activities a ON a.id = ha.activity_id
       WHERE ha.hotel_id = ?
       ORDER BY a.name`,
      [hotelId]
    )
    return rows as any[]
  }
}

export const roomTypeQueries = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM room_types ORDER BY id')
    return rows as any[]
  }
}

export const fileQueries = {
  async create(ownerUserId: number, originalName: string, mime: string, sizeBytes: number, storagePath: string) {
    const [result] = await pool.execute(
      'INSERT INTO files (owner_user_id, original_name, mime, size_bytes, storage_path, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [ownerUserId, originalName, mime, sizeBytes, storagePath]
    )
    return (result as any).insertId as number
  },

  async findById(id: number) {
    const [rows] = await pool.execute('SELECT * FROM files WHERE id = ?', [id])
    return (rows as any[])[0] ?? null
  },

  async deleteById(id: number) {
    await pool.execute('DELETE FROM files WHERE id = ?', [id])
  }
}

export const ownerQueries = {
  async createHotel(name: string, city: string, address: string, description: string, nearby: string, ownerId: number) {
    const [result] = await pool.execute(
      "INSERT INTO hotels (name, city, address, description, nearby, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, NOW())",
      [name, city, address, description, nearby || null, ownerId]
    )
    return result
  },

  async findByOwner(ownerId: number) {
    const [rows] = await pool.execute(
      `SELECT h.*,
         MIN(r.price_per_night) AS min_price,
         COUNT(r.id) AS room_count
       FROM hotels h
       LEFT JOIN rooms r ON r.hotel_id = h.id AND r.deleted_at IS NULL
       WHERE h.created_by = ? AND h.deleted_at IS NULL
       GROUP BY h.id
       ORDER BY h.created_at DESC`,
      [ownerId]
    )
    return rows as any[]
  },

  async findOwnerHotelById(id: number, ownerId: number) {
    const [rows] = await pool.execute(
      'SELECT * FROM hotels WHERE id = ? AND created_by = ? AND deleted_at IS NULL',
      [id, ownerId]
    )
    return (rows as any[])[0] ?? null
  },

  async updateHotel(id: number, name: string, city: string, address: string, description: string, nearby: string, ownerId: number) {
    const [result] = await pool.execute(
      "UPDATE hotels SET name = ?, city = ?, address = ?, description = ?, nearby = ?, status = 'pending' WHERE id = ? AND created_by = ? AND deleted_at IS NULL",
      [name, city, address, description, nearby || null, id, ownerId]
    )
    return result
  },

  async deleteHotel(id: number, ownerId: number) {
    const [result] = await pool.execute(
      'UPDATE hotels SET deleted_at = NOW() WHERE id = ? AND created_by = ? AND deleted_at IS NULL',
      [id, ownerId]
    )
    return result
  },

  async getHotelFull(id: number, ownerId: number) {
    const [hotelRows] = await pool.execute(
      'SELECT * FROM hotels WHERE id = ? AND created_by = ? AND deleted_at IS NULL',
      [id, ownerId]
    )
    const hotel = (hotelRows as any[])[0] ?? null
    if (!hotel) return null

    const [rooms] = await pool.execute(
      `SELECT r.*, rt.name AS type_name
       FROM rooms r
       JOIN room_types rt ON rt.id = r.room_type_id
       WHERE r.hotel_id = ? AND r.deleted_at IS NULL
       ORDER BY r.price_per_night`,
      [id]
    )

    const [amenities] = await pool.execute(
      `SELECT a.id, a.name FROM hotel_amenities ha
       JOIN amenities a ON a.id = ha.amenity_id
       WHERE ha.hotel_id = ? ORDER BY a.name`,
      [id]
    )

    const [images] = await pool.execute(
      `SELECT hi.id AS hotel_image_id, hi.sort_order, f.id AS file_id, f.original_name, f.storage_path
       FROM hotel_images hi
       JOIN files f ON f.id = hi.file_id
       WHERE hi.hotel_id = ?
       ORDER BY hi.sort_order, hi.created_at`,
      [id]
    )

    const [activities] = await pool.execute(
      `SELECT a.id, a.name, a.icon FROM hotel_activities ha
       JOIN activities a ON a.id = ha.activity_id
       WHERE ha.hotel_id = ? ORDER BY a.name`,
      [id]
    )

    return { ...hotel, rooms, amenities, activities, images }
  },

  async setActivities(hotelId: number, activityIds: number[]) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.execute('DELETE FROM hotel_activities WHERE hotel_id = ?', [hotelId])
      if (activityIds.length > 0) {
        const placeholders = activityIds.map(() => '(?, ?)').join(', ')
        const values = activityIds.flatMap(aId => [hotelId, aId])
        await conn.execute(`INSERT INTO hotel_activities (hotel_id, activity_id) VALUES ${placeholders}`, values)
      }
      await conn.commit()
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  },

  async setAmenities(hotelId: number, amenityIds: number[]) {
    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      await conn.execute('DELETE FROM hotel_amenities WHERE hotel_id = ?', [hotelId])
      if (amenityIds.length > 0) {
        const placeholders = amenityIds.map(() => '(?, ?)').join(', ')
        const values = amenityIds.flatMap(aId => [hotelId, aId])
        await conn.execute(`INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES ${placeholders}`, values)
      }
      await conn.commit()
    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  },

  async createRoom(hotelId: number, roomTypeId: number, name: string, capacity: number, beds: number, price: number, description: string) {
    const [result] = await pool.execute(
      'INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [hotelId, roomTypeId, name, capacity, beds, price, description || null]
    )
    return result
  },

  async updateRoom(roomId: number, hotelId: number, roomTypeId: number, name: string, capacity: number, beds: number, price: number, description: string) {
    const [result] = await pool.execute(
      `UPDATE rooms r
       JOIN hotels h ON h.id = r.hotel_id AND h.id = ?
       SET r.room_type_id = ?, r.name = ?, r.capacity = ?, r.beds = ?, r.price_per_night = ?, r.description = ?
       WHERE r.id = ? AND r.deleted_at IS NULL`,
      [hotelId, roomTypeId, name, capacity, beds, price, description || null, roomId]
    )
    return result
  },

  async deleteRoom(roomId: number, hotelId: number) {
    const [result] = await pool.execute(
      `UPDATE rooms r
       JOIN hotels h ON h.id = r.hotel_id AND h.id = ?
       SET r.deleted_at = NOW()
       WHERE r.id = ? AND r.deleted_at IS NULL`,
      [hotelId, roomId]
    )
    return result
  },

  async addImage(hotelId: number, fileId: number) {
    await pool.execute(
      'INSERT INTO hotel_images (hotel_id, file_id, sort_order, created_at) VALUES (?, ?, 0, NOW())',
      [hotelId, fileId]
    )
  },

  async deleteImage(hotelImageId: number, hotelId: number, ownerId: number) {
    const [rows] = await pool.execute(
      `SELECT hi.id, hi.file_id FROM hotel_images hi
       JOIN hotels h ON h.id = hi.hotel_id AND h.created_by = ?
       WHERE hi.id = ? AND hi.hotel_id = ?`,
      [ownerId, hotelImageId, hotelId]
    )
    const row = (rows as any[])[0]
    if (!row) return null
    await pool.execute('DELETE FROM hotel_images WHERE id = ?', [hotelImageId])
    return row.file_id as number
  },
}

export const roomQueries = {
  async findByHotel(hotelId: number) {
    const [rows] = await pool.execute(
      `SELECT r.*, rt.name AS type_name,
              GROUP_CONCAT(a.name ORDER BY a.name SEPARATOR ', ') AS amenities
       FROM rooms r
       JOIN room_types rt ON rt.id = r.room_type_id
       LEFT JOIN room_amenities ra ON ra.room_id = r.id
       LEFT JOIN amenities a ON a.id = ra.amenity_id
       WHERE r.hotel_id = ? AND r.deleted_at IS NULL
       GROUP BY r.id
       ORDER BY r.price_per_night`,
      [hotelId]
    )
    return rows as any[]
  }
}
