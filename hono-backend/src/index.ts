import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as z from 'zod'
import { sValidator } from '@hono/standard-validator'
import { initDatabase } from './db.js'
import auth from './auth.js'
import { requireAuth, requireAdmin } from './middleware.js'
import { hotelQueries } from './db.js'

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

// Admin only route example
app.get('/admin', requireAuth, requireAdmin, (c) => {
  return c.json({ 
    message: 'Admin dashboard data',
    secret: 'Only admins can see this'
  })
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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)

