import { serve }       from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono }        from 'hono'
import { cors }        from 'hono/cors'
import { streamSSE }   from 'hono/streaming'
import { randomUUID }  from 'crypto'
import fs              from 'fs'
import path            from 'path'
import auth from './auth.js'
import { requireAuth, requireAdmin, requireOwner } from './middleware.js'
import {
  hotelQueries, roomQueries, bookingQueries,
  adminQueries, ownerQueries,
  amenityQueries, activityQueries, roomTypeQueries,
  fileQueries,
} from './db.js'
import { error } from 'console'

// Make sure the uploads folder exists when the server starts.
// Uploaded hotel images are stored here and served as static files.
fs.mkdirSync('uploads', { recursive: true })


type Variables = {
  user?: {
    id:    number
    name:  string
    email: string
    role:  string
  }
}

const app = new Hono<{ Variables: Variables }>()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.use('/uploads/*', serveStatic({ root: './' }))

app.route('/auth', auth)

type SSESender = (event: string, data: object) => Promise<void>
const adminStreams = new Set<SSESender>()

async function broadcastToAdmins(event: string, data: object) {
  const dead: SSESender[] = []
  for (const send of adminStreams) {
    try {
      await send(event, data)
    } catch {
      dead.push(send)
    }
  }
  dead.forEach(fn => adminStreams.delete(fn))
}

// Search hotels with optional filters:
//   ?city=Bratislava  — partial match on hotel city
//   ?maxPrice=200     — only show hotels with a room at or below this price
//   ?guests=3         — only show hotels with a room that fits this many guests
//   ?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD  — exclude hotels with no free rooms
app.get('/hotels', async (c) => {
  const filters = {
    city:     c.req.query('city'),
    minPrice: c.req.query('minPrice'),
    maxPrice: c.req.query('maxPrice'),
    guests:   c.req.query('guests'),
    checkIn:  c.req.query('checkIn'),
    checkOut: c.req.query('checkOut'),
  }
  return c.json(await hotelQueries.findAll(filters))
})

app.get('/hotels/:id', async (c) => {
  const id    = parseInt(c.req.param('id'))
  const hotel = await hotelQueries.findByIdFull(id)
  if (!hotel) return c.json({ error: 'Hotel not found' }, 404)
  return c.json(hotel)
})

// Each room includes its type name and comma-separated amenity list.
app.get('/hotels/:id/rooms', async (c) => {
  const id    = parseInt(c.req.param('id'))
  const rooms = await roomQueries.findByHotel(id)
  return c.json(rooms)
})

// Returns confirmed bookings for the next 60 days so the frontend
// can shade booked dates on the calendar without doing SQL itself.
app.get('/hotels/:id/booked-dates', async (c) => {
  const id     = parseInt(c.req.param('id'))
  const ranges = await hotelQueries.getBookedDateRanges(id)
  return c.json(ranges)
})

app.get('/amenities',  async (c) => c.json(await amenityQueries.findAll()))
app.get('/activities', async (c) => c.json(await activityQueries.findAll()))
app.get('/room-types', async (c) => c.json(await roomTypeQueries.findAll()))

app.post('/bookings', requireAuth, async (c) => {
  const user = c.get('user')!
  const { roomId, checkIn, checkOut, guests, note } = await c.req.json()

  if (!roomId || !checkIn || !checkOut || !guests)
    return c.json({ error: 'roomId, checkIn, checkOut and guests are required' }, 400)

  if (new Date(checkOut) <= new Date(checkIn))
    return c.json({ error: 'Check-out must be after check-in' }, 400)

  await bookingQueries.create(user.id, roomId, checkIn, checkOut, guests, note || '')
  return c.json({ ok: true })
})

app.get('/bookings/my', requireAuth, async (c) => {
  const user     = c.get('user')!
  const bookings = await bookingQueries.findByUser(user.id)
  return c.json(bookings)
})

// Only the user who made the booking can cancel it.
app.put('/bookings/:id/cancel', requireAuth, async (c) => {
  const user    = c.get('user')!
  const id      = parseInt(c.req.param('id'))
  const booking = await bookingQueries.findById(id)

  if (!booking)              return c.json({ error: 'Booking not found' }, 404)
  if (booking.user_id !== user.id) return c.json({ error: 'Not your booking' }, 403)

  await bookingQueries.cancel(id, user.id)
  return c.json({ ok: true })
})

app.get('/owner/hotels', requireAuth, requireOwner, async (c) => {
  const user   = c.get('user')!
  const hotels = await ownerQueries.findByOwner(user.id)
  return c.json(hotels)
})

app.get('/owner/hotels/:id', requireAuth, requireOwner, async (c) => {
  const user  = c.get('user')!
  const id    = parseInt(c.req.param('id'))
  const hotel = await ownerQueries.getHotelFull(id, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)
  return c.json(hotel)
})

app.get('/owner/hotels/:id/bookings', requireAuth, requireOwner, async (c) => {
  const user = c.get('user')!
  const hotelId = parseInt(c.req.param('id'))
  const hotel = await ownerQueries.findOwnerHotelById(hotelId, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  const bookings = await bookingQueries.findByHotel(hotelId)
  return c.json(bookings)
})

app.put('/owner/bookings/:id/accept', requireAuth, requireOwner, async (c) => {
  const user = c.get('user')!
  const id = parseInt(c.req.param('id'))
  const result = await bookingQueries.accept(id, user.id)
  if ((result as any).affectedRows === 0) {
    return c.json({ error: 'Booking not found or not yours' }, 404)
  }
  return c.json({ ok: true })
})

app.put('/owner/bookings/:id/reject', requireAuth, requireOwner, async (c) => {
  const user = c.get('user')!
  const id = parseInt(c.req.param('id'))
  const result = await bookingQueries.reject(id, user.id)
  if ((result as any).affectedRows === 0) {
    return c.json({ error: 'Booking not found or not yours' }, 404)
  }
  return c.json({ ok: true })
})

// Status is automatically set to 'pending' — an admin must approve it
// before it shows up in the public search results.
// Also notifies all connected admins via SSE.
app.post('/owner/hotels', requireAuth, requireOwner, async (c) => {
  const user = c.get('user')!
  const { name, city, address, description, nearby } = await c.req.json()

  if (!name || !city) return c.json({ error: 'Name and city are required' }, 400)

  await ownerQueries.createHotel(name, city, address || '', description || '', nearby || '', user.id)
  broadcastToAdmins('new_listing', { hotelName: name, city, ownerName: user.name || user.email })
  return c.json({ ok: true })
})

// Resets status to 'pending' so the admin re-reviews the changes before the listing goes public again.
app.put('/owner/hotels/:id', requireAuth, requireOwner, async (c) => {
  const user  = c.get('user')!
  const id    = parseInt(c.req.param('id'))
  const hotel = await ownerQueries.findOwnerHotelById(id, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  const { name, city, address, description, nearby } = await c.req.json()
  if (!name || !city) return c.json({ error: 'Name and city are required' }, 400)

  await ownerQueries.updateHotel(id, name, city, address || '', description || '', nearby || '', user.id)
  return c.json({ ok: true })
})

// Soft-delete the hotel (sets deleted_at, does not destroy data).
app.delete('/owner/hotels/:id', requireAuth, requireOwner, async (c) => {
  const user  = c.get('user')!
  const id    = parseInt(c.req.param('id'))
  const hotel = await ownerQueries.findOwnerHotelById(id, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  await ownerQueries.deleteHotel(id, user.id)
  return c.json({ ok: true })
})

// Sends the full desired list; the query deletes the old list and inserts the new one.
app.put('/owner/hotels/:id/amenities', requireAuth, requireOwner, async (c) => {
  const user  = c.get('user')!
  const id    = parseInt(c.req.param('id'))
  const hotel = await ownerQueries.findOwnerHotelById(id, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  const { amenityIds } = await c.req.json()
  await ownerQueries.setAmenities(id, Array.isArray(amenityIds) ? amenityIds.map(Number) : [])
  return c.json({ ok: true })
})

app.put('/owner/hotels/:id/activities', requireAuth, requireOwner, async (c) => {
  const user  = c.get('user')!
  const id    = parseInt(c.req.param('id'))
  const hotel = await ownerQueries.findOwnerHotelById(id, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  const { activityIds } = await c.req.json()
  await ownerQueries.setActivities(id, Array.isArray(activityIds) ? activityIds.map(Number) : [])
  return c.json({ ok: true })
})

app.post('/owner/hotels/:id/rooms', requireAuth, requireOwner, async (c) => {
  const user    = c.get('user')!
  const hotelId = parseInt(c.req.param('id'))
  const hotel   = await ownerQueries.findOwnerHotelById(hotelId, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  const { name, roomTypeId, capacity, beds, pricePerNight, description } = await c.req.json()
  if (!name || !roomTypeId || !capacity || !beds || pricePerNight == null)
    return c.json({ error: 'name, roomTypeId, capacity, beds and pricePerNight are required' }, 400)

  await ownerQueries.createRoom(
    hotelId, Number(roomTypeId), name,
    Number(capacity), Number(beds), Number(pricePerNight), description || ''
  )
  return c.json({ ok: true })
})

// Ownership is verified by checking that the room's hotel belongs to the logged-in owner.
app.put('/owner/rooms/:id', requireAuth, requireOwner, async (c) => {
  const user   = c.get('user')!
  const roomId = parseInt(c.req.param('id'))
  const { hotelId, name, roomTypeId, capacity, beds, pricePerNight, description } = await c.req.json()

  if (!hotelId || !name || !roomTypeId || !capacity || !beds || pricePerNight == null)
    return c.json({ error: 'hotelId, name, roomTypeId, capacity, beds and pricePerNight are required' }, 400)

  const hotel = await ownerQueries.findOwnerHotelById(Number(hotelId), user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  await ownerQueries.updateRoom(
    roomId, Number(hotelId), Number(roomTypeId), name,
    Number(capacity), Number(beds), Number(pricePerNight), description || ''
  )
  return c.json({ ok: true })
})

// Soft-delete a room (sets deleted_at).
app.delete('/owner/rooms/:id', requireAuth, requireOwner, async (c) => {
  const user   = c.get('user')!
  const roomId = parseInt(c.req.param('id'))
  const { hotelId } = await c.req.json()

  if (!hotelId) return c.json({ error: 'hotelId is required' }, 400)

  const hotel = await ownerQueries.findOwnerHotelById(Number(hotelId), user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  await ownerQueries.deleteRoom(roomId, Number(hotelId))
  return c.json({ ok: true })
})

// Validates file type and size, saves the file to disk,
// stores metadata in the files table, and links it to the hotel.
app.post('/owner/hotels/:id/images', requireAuth, requireOwner, async (c) => {
  const user    = c.get('user')!
  const hotelId = parseInt(c.req.param('id'))
  const hotel   = await ownerQueries.findOwnerHotelById(hotelId, user.id)
  if (!hotel) return c.json({ error: 'Hotel not found or not yours' }, 404)

  const body = await c.req.parseBody()
  const file = body['image'] as File | undefined
  if (!file || typeof file === 'string') return c.json({ error: 'No image file provided' }, 400)

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!ALLOWED_TYPES.includes(file.type))
    return c.json({ error: 'Only JPEG, PNG, WebP and GIF images are allowed' }, 400)

  if (file.size > 5 * 1024 * 1024)
    return c.json({ error: 'File must be under 5 MB' }, 400)

  // Generate a unique filename to prevent collisions and path traversal attacks.
  const ext         = path.extname(file.name) || '.jpg'
  const filename    = randomUUID() + ext
  const storagePath = path.join('uploads', filename)
  fs.writeFileSync(storagePath, Buffer.from(await file.arrayBuffer()))

  const fileId = await fileQueries.create(user.id, file.name, file.type, file.size, storagePath)
  await ownerQueries.addImage(hotelId, fileId)

  return c.json({ ok: true, url: `/uploads/${filename}` })
})

// Removes the file from disk and cleans up the DB records.
app.delete('/owner/hotels/:hotelId/images/:imageId', requireAuth, requireOwner, async (c) => {
  const user    = c.get('user')!
  const hotelId = parseInt(c.req.param('hotelId'))
  const imageId = parseInt(c.req.param('imageId'))

  const fileId = await ownerQueries.deleteImage(imageId, hotelId, user.id)
  if (fileId == null) return c.json({ error: 'Image not found or not yours' }, 404)

  // Delete the file from disk (ignore errors if file is already gone).
  const fileRecord = await fileQueries.findById(fileId)
  if (fileRecord?.storage_path) {
    try { fs.unlinkSync(fileRecord.storage_path) } catch { /* already deleted */ }
  }
  await fileQueries.deleteById(fileId)
  return c.json({ ok: true })
})

app.get('/admin/stats', requireAuth, requireAdmin, async (c) => {
  return c.json(await adminQueries.getStats())
})

app.get('/admin/hotels', requireAuth, requireAdmin, async (c) => {
  return c.json(await hotelQueries.findAll())
})

app.get('/admin/hotels/pending', requireAuth, requireAdmin, async (c) => {
  return c.json(await adminQueries.getPendingHotels())
})

app.get('/admin/hotels/:id/full', requireAuth, requireAdmin, async (c) => {
  const id    = parseInt(c.req.param('id'))
  const hotel = await adminQueries.getHotelFull(id)
  if (!hotel) return c.json({ error: 'Hotel not found' }, 404)
  return c.json(hotel)
})

// Admin creates a hotel directly — it goes live immediately (status = 'approved').
app.post('/admin/hotels', requireAuth, requireAdmin, async (c) => {
  const user = c.get('user')!
  const { name, city, address, description } = await c.req.json()
  if (!name || !city) return c.json({ error: 'Name and city are required' }, 400)
  await adminQueries.createHotel(name, city, address || '', description || '', user.id)
  return c.json({ ok: true })
})

app.put('/admin/hotels/:id', requireAuth, requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  const { name, city, address, description } = await c.req.json()
  if (!name || !city) return c.json({ error: 'Name and city are required' }, 400)
  await adminQueries.updateHotel(id, name, city, address || '', description || '')
  return c.json({ ok: true })
})

// Soft-delete a hotel.
app.delete('/admin/hotels/:id', requireAuth, requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  await adminQueries.deleteHotel(id)
  return c.json({ ok: true })
})

// Approve a pending hotel — it becomes visible in public search.
app.put('/admin/hotels/:id/approve', requireAuth, requireAdmin, async (c) => {
  const id = parseInt(c.req.param('id'))
  await adminQueries.approveHotel(id)
  return c.json({ ok: true })
})

// Reject a pending hotel with an optional reason shown to the owner.
app.put('/admin/hotels/:id/reject', requireAuth, requireAdmin, async (c) => {
  const id             = parseInt(c.req.param('id'))
  const { reason }     = await c.req.json()
  await adminQueries.rejectHotel(id, reason || 'No reason provided')
  return c.json({ ok: true })
})

app.get('/admin/bookings', requireAuth, requireAdmin, async (c) => {
  return c.json(await adminQueries.getAllBookings())
})

app.get('/admin/users', requireAuth, requireAdmin, async (c) => {
  return c.json(await adminQueries.getAllUsers())
})

// An admin cannot change their own role to prevent accidental lockout.
app.put('/admin/users/:id/role', requireAuth, requireAdmin, async (c) => {
  const id          = parseInt(c.req.param('id'))
  const { role }    = await c.req.json()
  const currentUser = c.get('user')!

  const VALID_ROLES = ['user', 'owner', 'admin']
  if (!VALID_ROLES.includes(role))
    return c.json({ error: 'Role must be user, owner or admin' }, 400)

  if (currentUser.id === id)
    return c.json({ error: 'Cannot change your own role' }, 400)

  await adminQueries.updateUserRole(id, role)
  return c.json({ ok: true })
})

// Admins connect here and stay connected via a long-lived HTTP stream.
// The server pushes events (e.g. 'new_listing') without the client polling.
// When the tab closes the stream is cancelled and cleanup happens in finally{}.
app.get('/admin/events', requireAuth, requireAdmin, (c) => {
  return streamSSE(c, async (stream) => {
    const send: SSESender = (event, data) =>
      stream.writeSSE({ event, data: JSON.stringify(data) })

    adminStreams.add(send)
    await stream.writeSSE({ event: 'connected', data: JSON.stringify({ ok: true }) })

    try {
      // Ping every 25 seconds to keep proxies from closing the connection.
      while (true) {
        await stream.sleep(25000)
        await stream.writeSSE({ event: 'ping', data: '{}' })
      }
    } finally {
      adminStreams.delete(send)
    }
  })
})

serve(
  { fetch: app.fetch, port: 3000 },
  (info) => console.log(`Server running at http://localhost:${info.port}`)
)
