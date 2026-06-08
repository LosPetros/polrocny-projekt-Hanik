import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { sessionQueries, userQueries } from './db.js'

// Extend Context to include user info
export interface AuthContext {
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

// Middleware to check if user is authenticated
export async function requireAuth(c: Context, next: Next) {
  const token = getCookie(c, 'session')

  if (!token) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  // Find valid session
  const session = await sessionQueries.findByToken(token)

  if (!session) {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }

  // Get user info
  const user = await userQueries.findById(session.user_id)

  if (!user) {
    return c.json({ error: 'User not found' }, 401)
  }

  // Attach user to context
  c.set('user', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  })

  await next()
}

// Middleware to check if user is admin
export async function requireAdmin(c: Context, next: Next) {
  const user = c.get('user') as AuthContext['user']

  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Admin access required' }, 403)
  }

  await next()
}

// Middleware to check if user is a hotel owner
export async function requireOwner(c: Context, next: Next) {
  const user = c.get('user') as AuthContext['user']

  if (!user || user.role !== 'owner') {
    return c.json({ error: 'Hotel owner access required' }, 403)
  }

  await next()
}
