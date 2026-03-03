# Týždenný report #3 (kombinovaný týždeň 2 + 3)

## Vykonané práce:

### Týždeň 2 — Backend & Autentifikácia

- Nastavil som **Hono backend** (Node.js + TypeScript) s REST API na porte 3000
- Implementoval som **autentifikáciu** — register, login, logout, `/auth/me`
- Heslá sú hashované pomocou **bcryptjs**, session uložená v HTTP-only cookie (platnosť 7 dní)
- Validácia vstupov pomocou **Zod**
- Nastavil som **Vue 3 frontend** s Vue Router, Pinia store a Tailwind CSS

### Týždeň 3 — Databáza & Vyhľadávanie hotelov

- Migroval som databázu zo **SQLite na MySQL** cez XAMPP / phpMyAdmin
- Navrhol som finálnu **databázovú schému** — 13 tabuliek (users, user_profiles, sessions, hotels, rooms, room_types, amenities, room_amenities, bookings, booking_files, favorites, files, hotel_images)
- Vytvoril som **seed dáta** — 6 hotelov na Slovensku, 24 izieb, 15 amenít, 5 typov izieb
- Implementoval som endpoint `GET /hotels` s filtrovaním podľa mesta, ceny a počtu hostí
- Vytvoril som **search stránku** napojenu na reálnu databázu s funkčnými filtrami

## Zmeny:

- `hono-backend/src/db.ts` — nový databázový layer (MySQL, connection pool)
- `hono-backend/src/auth.ts` — autentifikačné routes
- `hono-backend/src/middleware.ts` — requireAuth, requireAdmin middleware
- `hono-backend/src/index.ts` — GET /hotels endpoint s filtrami
- `hono-backend/schema.sql` — SQL schéma pre phpMyAdmin
- `hono-backend/seed.sql` — seed dáta (hotely, izby, amenity)
- `hono-client/src/pages/SearchPage.vue` — vyhľadávanie hotelov z DB
- `hono-client/src/stores/auth.js` — Pinia auth store
- `hono-client/src/style.css` — custom slider štýly

## TODO (ďalšie kroky):

- [ ] **Rezervácia hotela** — formulár výberu izby, dátumov a počtu hostí, uloženie do tabuľky `bookings`
- [ ] **Moje rezervácie** — stránka zobrazujúca skutočné rezervácie prihláseného užívateľa z DB
- [ ] **Admin panel** — prehľad rezervácií, správa hotelov
- [ ] **Zrušenie rezervácie** — možnosť stornovania s aktualizáciou stavu v DB
- [ ] **Rework UI** — vizuálne vylepšenie stránok (My Bookings, Admin)
