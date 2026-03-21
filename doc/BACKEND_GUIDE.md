# Hotelex Backend - Complete Guide

Tento guide ti vysvetli kazdy backend subor, co robi, preco, a ako to cele funguje dohromady.

---

## 1. Ako to cele funguje (velky obrazok)

```
BROWSER (Vue frontend, port 5173)
    |
    |  HTTP requesty (GET, POST, PUT, DELETE)
    |  posiela JSON data + cookie
    |
    v
HONO BACKEND (Node.js server, port 3000)
    |
    |  SQL queries (SELECT, INSERT, UPDATE)
    |
    v
MYSQL DATABAZA (XAMPP, port 3306)
```

Frontend posle request na backend (napr. "daj mi vsetky hotely").
Backend spusti SQL query v databaze, dostane data, a posle ich spat ako JSON.

---

## 2. XAMPP a MySQL - ako to funguje

### Co je XAMPP?
XAMPP je program ktory ti na PC spusti MySQL databazu. Ked otvoris XAMPP Control Panel a kliknes "Start" pri MySQL, spusti sa databazovy server na porte 3306.

### Ako sa backend pripaja?
V subore `db.ts` (riadok 4-12):

```typescript
export const pool = mysql.createPool({
  host: 'localhost',      // databaza bezi na tvojom PC
  user: 'root',           // default XAMPP user
  password: '',           // default XAMPP nema heslo
  database: 'hotelex',    // nazov databazy
  port: 3306,             // default MySQL port
  connectionLimit: 10,    // max 10 sucasnych pripojeni
})
```

`pool` je "connection pool" - miesto z ktoreho si backend berie pripojenie na databazu ked potrebuje spravit query. Netvori sa nove pripojenie pri kazdom requeste, ale znovu pouziva existujuce - to je rychlejsie.

### Ako vznikla databaza?
1. V phpMyAdmin si vytvoril databazu `hotelex`
2. Spustil si `schema.sql` - to vytvorilo vsetky tabulky (users, hotels, rooms, bookings, atd.)
3. Spustil si `seed.sql` - to naplnilo tabulky testovacimi datami (admin user, 6 hotelov, izby, amenities)

---

## 3. Subory backendu - prehled

```
hono-backend/src/
  index.ts       <- Hlavny subor. Tu su vsetky API endpointy (routy).
  db.ts          <- Vsetky SQL queries. Backend tu vola funkcie na citanie/zapis dat.
  auth.ts        <- Login, register, logout endpointy.
  middleware.ts  <- Funkcie ktore kontroluju ci je user prihlaseny / ci je admin.
```

---

## 4. db.ts - Databazove queries (podrobne)

Tento subor obsahuje VSETKY SQL dotazy. Kazda skupina je objekt s async funkciami.

### userQueries

**`create(name, email, passwordHash, role, createdAt)`**
- Pouziva TRANSACTION - to znamena: spravi 2 INSERTy (do `users` a `user_profiles`) naraz. Ak jeden zlyha, druhy sa tiez zrusi (rollback). Toto zaruci ze nevznikne user bez profilu.
```sql
INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, ?)
INSERT INTO user_profiles (user_id, display_name, created_at) VALUES (?, ?, ?)
```
Otazniky `?` su **prepared statements** - chrani pred SQL injection. Databaza dostane zvlast query a zvlast data, takze nikto nemoze vlozit skodlivy SQL cez input.

**`findByEmail(email)`**
- Pouziva JOIN - spaja tabulku `users` s `user_profiles` aby dostal aj meno aj email v jednom dotaze.
- `WHERE u.deleted_at IS NULL` - ignoruje "zmazanych" userov (soft delete).

**`findById(id)`** - to iste ako findByEmail ale hlada podla ID.

### sessionQueries

**`create(token, userId, expiresAt, createdAt)`** - ulozi novu session do DB.

**`findByToken(token)`** - najde session podla tokenu, ale len ak este nevyprsal (`expires_at > NOW()`).

**`deleteByToken(token)`** - zmaze session (pri logoutu).

### hotelQueries

**`findAll(filters)`** - najkomplexnejsi query. Robi toto:
1. Vyberie vsetky hotely ktore nie su zmazane
2. JOINne rooms aby dostal najnizsiu cenu (`MIN(r.price_per_night)`)
3. JOINne amenities aby dostal zoznam vybavenia
4. Ak su filtre (mesto, cena, guests), prida WHERE/HAVING podmienky
5. `GROUP BY h.id` - zgrupi vysledky po hoteloch (lebo JOIN vytvara viacero riadkov pre kazdy hotel)

**`findById(id)`** - jednoducky SELECT jedneho hotela.

### bookingQueries

**`create(...)`** - INSERT novej rezervacie so statusom 'confirmed'.

**`findByUser(userId)`** - SELECT vsetkych bookingov daneho usera. Pouziva JOINy aby dostal aj meno hotela, izby, a pocet noci (`DATEDIFF`).

**`cancel(id, userId)`** - UPDATE statusu na 'cancelled'. Podmienka `AND user_id = ?` zaruci ze user moze zrusit len SVOJU rezervaciu.

### adminQueries

**`getStats()`** - 3x `SELECT COUNT(*)` - spocita hotely, userov, a bookingy.

**`getAllBookings()`** - Podobne ako `findByUser` ale bez WHERE na user_id - admin vidi VSETKO.

**`createHotel / updateHotel / deleteHotel`** - CRUD operacie pre hotely.
- deleteHotel robi SOFT DELETE (`SET deleted_at = NOW()`) - hotel sa nezmaze fyzicky, len sa oznaci datumod zmazania. Takto sa nerozbiju existujuce bookingy ktore na ten hotel odkazuju.

**`updateUserRole(userId, role)`** - zmeni rolu usera (user/admin).

---

## 5. auth.ts - Autentifikacia (podrobne)

### Ako funguje registracia? (POST /auth/register)

```
1. Prijme JSON: { name, email, password }
2. ZOD VALIDACIA - skontroluje ci email ma spravny format, ci heslo ma min 6 znakov
3. Skontroluje ci uz existuje user s takym emailom
4. HASHUJE heslo pomocou bcrypt (heslo sa NIKDY neuklada ako text!)
5. Ulozi usera do DB s rolou 'user'
6. Vrati { ok: true }
```

**Co je bcrypt hash?**
Ked user zada heslo "ahoj123", bcrypt z neho spravi nieco ako `$2a$10$MgFWKh56Buc3D1...` - dlhy nahodny string. Z hashu sa neda ziskat povodne heslo. Pri logine bcrypt porovna heslo s hashom.

### Ako funguje login? (POST /auth/login)

```
1. Prijme JSON: { email, password }
2. Najde usera v DB podla emailu
3. Porovna zadane heslo s hashom v DB (bcrypt.compare)
4. Ak sedi:
   a) Vytvori SESSION TOKEN (nahodny UUID, napr. "a3f4b2c1-...")
   b) Ulozi token do tabulky sessions (s expiraciou 7 dni)
   c) Posle token ako COOKIE v response
5. Vrati { ok: true, user: { id, name, email, role } }
```

**Co je cookie a preco ju pouzivame?**
Cookie je maly kusok dat ktory browser AUTOMATICKY posiela s kazdym requestom na ten isty server. Takze po logine:
- Browser dostane cookie `session=a3f4b2c1-...`
- Pri KAZDOM dalsom requeste browser automaticky posle tuto cookie
- Backend precita cookie, najde session v DB, a vie kto je prihlaseny

Cookie ma nastavenia:
- `httpOnly: true` - JavaScript na frontende NEMOZE citat tuto cookie (ochrana pred XSS)
- `sameSite: 'Lax'` - cookie sa neposle z inych stranok (ochrana pred CSRF)
- `maxAge: 7 dni` - po 7 dnoch sa cookie automaticky zmaze

### Ako funguje logout? (POST /auth/logout)
1. Precita session cookie
2. Zmaze session z DB
3. Zmaze cookie z browsera

### Ako funguje /auth/me? (GET /auth/me)
Frontendova appka vola tento endpoint po KAZDOM refreshi stranky. Ak je cookie platna, vrati uzivatela. Ak nie, vrati `{ user: null }`. Takto sa session zachova aj po reloade.

---

## 6. middleware.ts - Ochrana endpointov (podrobne)

Middleware je funkcia ktora sa spusti PRED tvojim endpointom. Ak kontrola zlyha, request sa zastavi a endpoint sa nespusti.

### requireAuth
```
1. Precita cookie "session" z requestu
2. Ak nie je cookie -> vrati 401 (Not authenticated)
3. Najde session v DB podla tokenu
4. Ak session neexistuje alebo vyprsal -> vrati 401
5. Najde usera podla session.user_id
6. Ak user neexistuje -> vrati 401
7. Pripravi user data do contextu (c.set('user', ...))
8. Pusti request dalej (await next())
```

### requireAdmin
```
1. Precita usera z contextu (ktoreho tam dal requireAuth)
2. Ak user.role !== 'admin' -> vrati 403 (Admin access required)
3. Ak je admin -> pusti dalej
```

### Ako sa middleware pouziva v index.ts:
```typescript
// Kazdy moze vidiet hotely - ziadny middleware
app.get('/hotels', async (c) => { ... })

// Len prihlaseny user moze vytvorit booking
app.post('/bookings', requireAuth, async (c) => { ... })

// Len admin moze vytvorit hotel - OBA middleware za sebou
app.post('/admin/hotels', requireAuth, requireAdmin, async (c) => { ... })
```

---

## 7. index.ts - Vsetky API endpointy (podrobne)

Toto je hlavny subor. Hono je web framework - podobne ako Express, ale modernejsi a jednoduchsi.

### Zakladna struktura endpointu:
```typescript
app.get('/hotels', async (c) => {
//  ^^^ HTTP metoda (GET/POST/PUT/DELETE)
//       ^^^^^^^^ URL cesta
//                      ^ c = context (request + response)
  const hotels = await hotelQueries.findAll()  // zavolaj DB
  return c.json(hotels)                         // vrat JSON response
})
```

### Vsetky endpointy:

| Metoda | URL | Middleware | Co robi |
|--------|-----|-----------|---------|
| POST | /auth/register | - | Registracia noveho usera |
| POST | /auth/login | - | Prihlasenie, vytvori session cookie |
| POST | /auth/logout | - | Odhlasenie, zmaze session |
| GET | /auth/me | - | Vrati aktualneho usera alebo null |
| GET | /hotels | - | Zoznam hotelov (s filtrami) |
| GET | /hotels/:id | - | Detail jedneho hotela |
| GET | /hotels/:id/rooms | - | Izby daneho hotela |
| POST | /bookings | requireAuth | Vytvor novu rezervaciu |
| GET | /bookings/my | requireAuth | Moje rezervacie |
| PUT | /bookings/:id/cancel | requireAuth | Zrus moju rezervaciu |
| GET | /admin/stats | requireAuth + requireAdmin | Statistiky (pocty) |
| GET | /admin/hotels | requireAuth + requireAdmin | Vsetky hotely (admin) |
| POST | /admin/hotels | requireAuth + requireAdmin | Pridaj hotel |
| PUT | /admin/hotels/:id | requireAuth + requireAdmin | Uprav hotel |
| DELETE | /admin/hotels/:id | requireAuth + requireAdmin | Zmaz hotel (soft) |
| GET | /admin/bookings | requireAuth + requireAdmin | Vsetky bookingy |
| GET | /admin/users | requireAuth + requireAdmin | Vsetci useri |
| PUT | /admin/users/:id/role | requireAuth + requireAdmin | Zmen rolu usera |

### CORS konfiguarcia (riadok 27-32)
```typescript
app.use(cors({
  origin: 'http://localhost:5173',  // povoleny len frontend
  credentials: true,                // povol posielanie cookies
}))
```
Bez CORS by browser BLOKOVAL requesty z frontendu (port 5173) na backend (port 3000) pretoze su na roznych portoch. CORS hovori browseru "je ok, tento frontend moze komunikovat so mnou".

---

## 8. Databazovy model (tabulky a vztahy)

```
users  ──1:1──  user_profiles     (kazdy user ma 1 profil)
users  ──1:N──  sessions          (user moze mat viac sessions)
users  ──1:N──  hotels            (admin vytvara hotely - created_by)
hotels ──1:N──  rooms             (hotel ma viac izieb)
rooms  ──N:M──  amenities         (izba ma viac amenities, amenity patri viacerym izbam)
                  ^ cez tabulku room_amenities
users  ──1:N──  bookings          (user ma viac rezervacii)
rooms  ──1:N──  bookings          (izba ma viac rezervacii)
```

### Klucove tabulky:

**users** - id, email, password_hash, role ('user'/'admin'), deleted_at
**sessions** - token (UUID), user_id, expires_at
**hotels** - id, name, city, address, description, created_by (FK na users)
**rooms** - id, hotel_id (FK), room_type_id (FK), name, capacity, beds, price_per_night
**bookings** - id, user_id (FK), room_id (FK), check_in, check_out, guests, status, cancelled_at

FK = Foreign Key = cudzii kluc = odkazuje na iny riadok v inej tabulke.

---

## 9. Bezpecnost - co je v kode implementovane

1. **Hesla su hashovane** (bcrypt) - nikdy sa neukladaju ako text
2. **Prepared statements** (`?` v SQL) - ochrana pred SQL injection
3. **HttpOnly cookies** - JavaScript nemoze precitat session cookie
4. **SameSite: Lax** - CSRF ochrana
5. **CORS** - len frontend na localhost:5173 moze volat API
6. **Role-based access** - middleware kontroluje ci je user admin
7. **Ownership check** - user moze zrusit len SVOJU rezervaciu
8. **Soft delete** - hotely sa nemazu fyzicky, zachovava sa historia
9. **Zod validacia** - vstupne data sa validuju pred spracovanim

---

## 10. Cely flow - co sa deje ked user spravi booking

```
1. User otvori /hotel/3 v browseri
   -> Frontend posle GET http://localhost:3000/hotels/3
   -> Backend spusti: SELECT * FROM hotels WHERE id = 3
   -> Vrati JSON s datami hotela

2. Frontend posle GET http://localhost:3000/hotels/3/rooms
   -> Backend spusti: SELECT rooms + JOIN room_types + JOIN amenities
   -> Vrati JSON so vsetkymi izbami

3. User klikne "Book Now", vyplni datumy, klikne "Confirm"
   -> Frontend posle POST http://localhost:3000/bookings
      s JSON: { roomId: 5, checkIn: "2026-04-01", checkOut: "2026-04-03", guests: 2 }
      + cookie "session=abc-123"

4. Backend middleware (requireAuth):
   -> Precita cookie "session=abc-123"
   -> SELECT * FROM sessions WHERE token = 'abc-123' AND expires_at > NOW()
   -> Najde session -> SELECT user WHERE id = session.user_id
   -> Prida usera do contextu

5. Backend endpoint:
   -> Precita JSON body
   -> Validuje (check-out musi byt po check-in)
   -> INSERT INTO bookings (user_id, room_id, check_in, check_out, guests, status)
      VALUES (2, 5, '2026-04-01', '2026-04-03', 2, 'confirmed')

6. Backend vrati { ok: true }
   -> Frontend presmeruje na /my-bookings
   -> Frontend posle GET http://localhost:3000/bookings/my (s cookie)
   -> Backend SELECT bookings JOIN rooms JOIN hotels WHERE user_id = 2
   -> Frontend zobrazi booking
```

---

## 11. Ako spustit projekt

1. Spusti XAMPP -> Start MySQL
2. Terminal 1: `cd hono-backend && npm run dev` (spusti backend na porte 3000)
3. Terminal 2: `cd hono-client && npm run dev` (spusti frontend na porte 5173)
4. Otvor http://localhost:5173

### Ako sa stat adminom:
- Login ako `admin@hotelex.sk` / `admin123` (seed data)
- Alebo v phpMyAdmin: `UPDATE users SET role = 'admin' WHERE email = 'tvoj@email.com';` a potom sa odhlasit a znova prihlasit
