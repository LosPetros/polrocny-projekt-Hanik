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
