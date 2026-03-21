import mysql from 'mysql2/promise'

// Create connection pool
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

// --------------------------------------------------------
// User queries
// --------------------------------------------------------
export const userQueries = {
  // Inserts into users + user_profiles in a transaction
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

  async deleteById(id: number) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    )
    return result
  }
}

// --------------------------------------------------------
// Session queries
// --------------------------------------------------------
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

// --------------------------------------------------------
// Hotel queries
// --------------------------------------------------------
export const hotelQueries = {
  async findAll(filters: { city?: string; minPrice?: string; maxPrice?: string; guests?: string } = {}) {
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
      LEFT JOIN rooms r ON r.hotel_id = h.id AND r.deleted_at IS NULL
      WHERE h.deleted_at IS NULL
    `
    const params: any[] = []
    const having: string[] = []
    const havingParams: any[] = []

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
      having.push(`(min_price <= ? OR min_price IS NULL)`)
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
  }
}

// --------------------------------------------------------
// Booking queries
// --------------------------------------------------------
export const bookingQueries = {
  async create(userId: number, roomId: number, checkIn: string, checkOut: string, guests: number, note: string) {
    const [result] = await pool.execute(
      'INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, status, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [userId, roomId, checkIn, checkOut, guests, 'confirmed', note || null]
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

// --------------------------------------------------------
// Admin queries
// --------------------------------------------------------
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

  async createHotel(name: string, city: string, address: string, description: string, createdBy: number) {
    const [result] = await pool.execute(
      'INSERT INTO hotels (name, city, address, description, created_by, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
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
}

// --------------------------------------------------------
// Room queries
// --------------------------------------------------------
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
