# Týždenný report #4

## Vykonané práce:

### UI upgrade — landing page, navbar, layout

- Vytvoril som **AppShell.vue** — globálny layout s pozadím (sky gradient + overlay)
- Vytvoril som **AppNavbar.vue** — navigácia s glass efektom, dynamické linky podľa prihlásenia a roly
- Vytvoril som **LandingPage.vue** (/) — hero sekcia, CTA tlačidlo, feature karty
- Prepojil som **SearchPage.vue** na reálne dáta z DB — hotel karty so skutočnými cenami a amenitami
- Pridaný sort (cena, relevancia) a loading skeleton na search stránku

### Admin panel — napojenie na backend

- Nahradil som statický admin dashboard funkčným — fetchuje dáta z API
- Pridal som admin endpointy: `GET /admin/stats`, `GET /admin/hotels`, `GET /admin/users`, `GET /admin/bookings`
- Implementoval som **CRUD pre hotely** cez admin panel (pridanie, úprava, soft delete)
- Pridaná správa užívateľov — možnosť zmeniť rolu (user/admin) priamo z admin rozhrania
- Admin panel má 3 taby: Hotels, Bookings, Users

## Zmeny:

- `hono-client/src/components/AppShell.vue` — nový layout komponent
- `hono-client/src/components/AppNavbar.vue` — nový navbar komponent
- `hono-client/src/pages/LandingPage.vue` — nová landing stránka
- `hono-client/src/pages/AdminPage.vue` — prepísaný z mockupu na funkčný panel
- `hono-backend/src/db.ts` — pridané adminQueries (getStats, createHotel, updateHotel, deleteHotel, getAllUsers, getAllBookings, updateUserRole)
- `hono-backend/src/index.ts` — nové admin endpointy s requireAuth + requireAdmin middleware
