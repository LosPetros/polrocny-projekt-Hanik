import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()
app.use(cors())

const users = ['Martin', 'Stefan', 'Robert', 'Maros']

app.get('/users', (c) => {
  return c.json(users)
})

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'))

  if (Number.isNaN(id)) {
    return c.text('Napisal si chujovinu')
  }

  return c.text(users[id])
})

app.post('/users', async (c) => {
  const body = await c.req.json()
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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
