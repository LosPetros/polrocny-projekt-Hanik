import { Hono } from 'hono'
import { setCookie, deleteCookie, getCookie } from 'hono/cookie'
import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { userQueries, sessionQueries } from './db.js'
import { requireAuth } from './middleware.js'

const auth = new Hono()

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format').refine(
    (email) => email.includes('@') && email.includes('.'),
    'Email must contain @ and .'
  ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'owner']).optional().default('user')
})

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
})

// Register endpoint
auth.post('/register', sValidator('json', registerSchema), async (c) => {
  try {
    const { name, email, password, role } = c.req.valid('json')

    // Check if user already exists
    const existingUser = await userQueries.findByEmail(email)
    if (existingUser) {
      return c.json({ error: 'Email already registered' }, 400)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await userQueries.create(name, email, passwordHash, role, now)

    return c.json({ ok: true, message: 'User registered successfully' })
  } catch (error) {
    console.error('Register error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
})

// Login endpoint
auth.post('/login', sValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json')

    // Find user
    const user = await userQueries.findByEmail(email)
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Create session token
    const token = randomUUID()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await sessionQueries.create(
      token,
      user.id,
      expiresAt.toISOString().slice(0, 19).replace('T', ' '),
      now.toISOString().slice(0, 19).replace('T', ' ')
    )

    // Set cookie
    setCookie(c, 'session', token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    })

    return c.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// Logout endpoint
auth.post('/logout', async (c) => {
  try {
    const token = getCookie(c, 'session')

    if (token) {
      await sessionQueries.deleteByToken(token)
    }

    deleteCookie(c, 'session')

    return c.json({ ok: true })
  } catch (error) {
    console.error('Logout error:', error)
    return c.json({ error: 'Logout failed' }, 500)
  }
})

// Get current user endpoint
auth.get('/me', async (c) => {
  try {
    const token = getCookie(c, 'session')

    if (!token) {
      return c.json({ user: null })
    }

    // Find session
    const session = await sessionQueries.findByToken(token)

    if (!session) {
      return c.json({ user: null })
    }

    // Get user
    const user = await userQueries.findById(session.user_id)

    if (!user) {
      return c.json({ user: null })
    }

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ user: null })
  }
})

// Delete own account
auth.delete('/me', requireAuth, async (c) => {
  try {
    const user = (c as any).get('user')
    await userQueries.softDelete(user.id)
    deleteCookie(c, 'session')
    return c.json({ ok: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return c.json({ error: 'Failed to delete account' }, 500)
  }
})

export default auth
