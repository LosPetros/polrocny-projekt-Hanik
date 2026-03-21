import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { initDatabase } from './db.js'
import auth from './auth.js'
import { requireAuth, requireAdmin } from './middleware.js'
import { hotelQueries, roomQueries, bookingQueries, adminQueries } from './db.js'

// Initialize database
initDatabase()

// Define app with typed context variables
type Variables = {
  user?: {
    id: number
    name: string
    email: string
    role: string
  }
}

const app = new Hono<{ Variables: Variables }>()

// CORS configuration for credentials (cookies)
app.use(cors({
  origin: 'http://localhost:5173', // Frontend dev URL
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type']
}))

// Mount auth routes
app.route('/auth', auth)

const users = ['Martin', 'Stefan', 'Robert', 'Maros']

// Public routes (demo)
app.get('/users', (c) => {
  return c.json(users)
})

// Protected route example - requires authentication
app.get('/protected', requireAuth, (c) => {
  const user = c.get('user')
  return c.json({ 
    message: 'This is a protected route',
    user 
  })
})

// ── Admin API ───────────────────────────────────────────

// Dashboard stats
app.get('/admin/stats', requireAuth, requireAdmin, async (c) => {
  const stats = await adminQueries.getStats()
  return c.json(stats)
})

// All hotels (admin view)
app.get('/admin/hotels', requireAuth, requireAdmin, async (c) => {
  const hotels = await hotelQueries.findAll()
  return c.json(hotels)
})

// Create hotel
app.post('/admin/hotels', requireAuth, requireAdmin, async (c) => {
  const { name, city, address, description } = await c.req.json()
  if (!name || !city) return c.json({ error: 'Name and city are required' }, 400)
  const user = c.get('user')!
  await adminQueries.createHotel(name, city, address || '', description || '', user.id)
  return c.json({ ok: true })
})

// Update hotel
app.put('/admin/hotels/:id', requireAuth, requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  const { name, city, address, description } = await c.req.json()
  if (!name || !city) return c.json({ error: 'Name and city are required' }, 400)
  await adminQueries.updateHotel(id, name, city, address || '', description || '')
  return c.json({ ok: true })
})

// Delete hotel (soft delete)
app.delete('/admin/hotels/:id', requireAuth, requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  await adminQueries.deleteHotel(id)
  return c.json({ ok: true })
})

// All bookings
app.get('/admin/bookings', requireAuth, requireAdmin, async (c) => {
  const bookings = await adminQueries.getAllBookings()
  return c.json(bookings)
})

// All users
app.get('/admin/users', requireAuth, requireAdmin, async (c) => {
  const users = await adminQueries.getAllUsers()
  return c.json(users)
})

// Update user role
app.put('/admin/users/:id/role', requireAuth, requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  const { role } = await c.req.json()
  if (role !== 'user' && role !== 'admin') return c.json({ error: 'Role must be user or admin' }, 400)
  const currentUser = c.get('user')!
  if (currentUser.id === id) return c.json({ error: 'Cannot change your own role' }, 400)
  await adminQueries.updateUserRole(id, role)
  return c.json({ ok: true })
})

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))

  if (Number.isNaN(id)) {
    return c.text('Napisal si chujovinu')
  }

  return c.text(users[id])
})

const schema = z.object({
  newUsername: z.email(),
})

app.post('/users', sValidator('json', schema), async (c) => {
  const body = c.req.valid('json')
  users.push(body.newUsername)
  return c.text('ok')
})

app.delete('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))

  if (Number.isNaN(id)) {
    return c.text('Napisal si chujovinu')
  }

  users.splice(id, 1)

  return c.text('ok')
})

app.get('/hotels', async (c) => {
  const city     = c.req.query('city')
  const minPrice = c.req.query('minPrice')
  const maxPrice = c.req.query('maxPrice')
  const guests   = c.req.query('guests')

  const hotels = await hotelQueries.findAll({ city, minPrice, maxPrice, guests })
  return c.json(hotels)
})

// Hotel detail
app.get('/hotels/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const hotel = await hotelQueries.findById(id)
  if (!hotel) return c.json({ error: 'Hotel not found' }, 404)
  return c.json(hotel)
})

// Rooms for a hotel
app.get('/hotels/:id/rooms', async (c) => {
  const id = parseInt(c.req.param('id'))
  const rooms = await roomQueries.findByHotel(id)
  return c.json(rooms)
})

// ── Bookings ────────────────────────────────────────────

// Create booking
app.post('/bookings', requireAuth, async (c) => {
  const user = c.get('user')!
  const { roomId, checkIn, checkOut, guests, note } = await c.req.json()
  if (!roomId || !checkIn || !checkOut || !guests) {
    return c.json({ error: 'roomId, checkIn, checkOut and guests are required' }, 400)
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    return c.json({ error: 'Check-out must be after check-in' }, 400)
  }
  await bookingQueries.create(user.id, roomId, checkIn, checkOut, guests, note || '')
  return c.json({ ok: true })
})

// My bookings
app.get('/bookings/my', requireAuth, async (c) => {
  const user = c.get('user')!
  const bookings = await bookingQueries.findByUser(user.id)
  return c.json(bookings)
})

// Cancel booking
app.put('/bookings/:id/cancel', requireAuth, async (c) => {
  const user = c.get('user')!
  const id = parseInt(c.req.param('id'))
  const booking = await bookingQueries.findById(id)
  if (!booking) return c.json({ error: 'Booking not found' }, 404)
  if (booking.user_id !== user.id) return c.json({ error: 'Not your booking' }, 403)
  await bookingQueries.cancel(id, user.id)
  return c.json({ ok: true })
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)

