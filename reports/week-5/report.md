# Týždenný report #5

## Vykonané práce:

### Booking flow — kompletná rezervácia

- Vytvoril som **HotelDetailPage.vue** (/hotel/:id) — zobrazuje info o hoteli + zoznam izieb s cenami, kapacitou a amenitami
- Implementoval som **booking modal** — výber dátumov, počet hostí, automatický výpočet celkovej ceny (noci x cena)
- Po potvrdení sa rezervácia uloží do DB a user je presmerovaný na My Bookings

### Backend endpointy pre bookings

- `GET /hotels/:id` — detail hotela
- `GET /hotels/:id/rooms` — izby daného hotela (JOIN room_types + amenities)
- `POST /bookings` — vytvorenie rezervácie (vyžaduje prihlásenie, validuje dátumy)
- `GET /bookings/my` — moje rezervácie (JOIN rooms + hotels + DATEDIFF pre počet nocí)
- `PUT /bookings/:id/cancel` — zrušenie vlastnej rezervácie (ownership check)

### My Bookings — napojenie na reálne dáta

- Prepísal som **MyBookingsPage.vue** z hardcoded dát na fetch z API
- Zobrazuje hotel, izbu, dátumy, počet hostí, celkovú cenu, status badge
- Funkčné tlačidlo Cancel — volá API a aktualizuje zoznam

## Zmeny:

- `hono-client/src/pages/HotelDetailPage.vue` — nová stránka
- `hono-client/src/pages/MyBookingsPage.vue` — prepísaný na reálne dáta
- `hono-client/src/pages/SearchPage.vue` — "View Details" teraz linkuje na /hotel/:id
- `hono-client/src/router/index.js` — nová routa /hotel/:id
- `hono-backend/src/db.ts` — pridané bookingQueries (create, findByUser, findById, cancel)
- `hono-backend/src/index.ts` — nové endpointy pre hotels detail a bookings
