# 🎨 Hotelex – Design Document (vychádza z tvojho screenshotu)

## 1️⃣ Celkový vizuálny štýl

### Typ dizajnu

* Clean
* Light mode
* Soft gradients
* Subtle blur / sky background
* Modern SaaS / Booking.com + Apple vibe

Toto  **nie je flat white page** . Je to:

> Svetlý layout + jemný modro-fialový gradient + obloha ako hero background.

---

# 🌤 2️⃣ Background (kľúčová vec)

Z tvojho obrázka:

### Background nie je obyčajná farba.

Je to kombinácia:

1. Very light blue/grey gradient
2. Jemný sky texture (mraky)
3. Soft white overlay (aby to nebolo agresívne)

### Vizual breakdown:

Top section:

* Svetlomodrá obloha
* Jemný gradient z:
  * #f4f7fb
  * do #eaf1f9
* Veľmi jemný blur

Spodok:

* Fade do čistej bielej

---

### 🎯 CSS koncept backgroundu

<pre class="overflow-visible! px-0!" data-start="884" data-end="1073"><div class="w-full my-4"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border corner-superellipse/1.1 border-token-border-light bg-token-bg-elevated-secondary rounded-3xl"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="pointer-events-none absolute inset-x-px top-6 bottom-6"><div class="sticky z-1!"><div class="bg-token-bg-elevated-secondary sticky"></div></div></div><div class="corner-superellipse/1.1 rounded-3xl bg-token-bg-elevated-secondary"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼs ͼ16"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼ13">background</span><span>: </span><span class="ͼ10">linear-gradient</span><span>(</span><br/><span></span><span class="ͼ13">to</span><span></span><span class="ͼ13">bottom</span><span>,</span><br/><span></span><span class="ͼ10">rgba</span><span>(230, 240, 255, 0.6),</span><br/><span></span><span class="ͼ10">rgba</span><span>(255, 255, 255, 1)</span><br/><span>),</span><br/><span class="ͼy">url</span><span>(</span><span class="ͼz">'/images/sky.jpg'</span><span>);</span><br/><span class="ͼ13">background-size</span><span>: </span><span class="ͼ10">cover</span><span>;</span><br/><span class="ͼ13">background-position</span><span>: </span><span class="ͼ10">top</span><span></span><span class="ͼ13">center</span><span>;</span></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

* blur cez pseudo element alebo backdrop filter.

---

# 🧊 3️⃣ Glass / Card systém

Všetky panely (filters, cards, forms):

Majú:

* white background
* border-radius: 20px
* box-shadow veľmi jemný
* border: 1px solid rgba(0,0,0,0.05)

Žiadne tmavé boxy.

Žiadne silné shadow.

Žiadne tvrdé hrany.

---

# 🔵 4️⃣ Farby

### Primary brand gradient:

* #6c8ff8
* #8c6cf8

Použité na:

* Search button
* CTA tlačidlá
* Hover efekty
* Active states

### Neutral:

* Text: #1f2937
* Secondary text: #6b7280
* Borders: #e5e7eb
* Background: #f8fafc

---

# 🧭 5️⃣ Layout flow aplikácie

---

## 🏠 1. Landing page

### Sekcie:

1. Hero (sky background)
   * Headline
   * Subtitle
   * Search bar
2. Featured hotels
   * 3–4 cards
3. Benefits
   * Secure booking
   * Best prices
   * Easy cancellation
4. Footer

---

## 🔎 2. Search page (ten screenshot)

Layout:

| Sidebar Filters | Hotel Grid |

### Sidebar:

* Destination
* Dates
* Guests
* Price range slider
* Star rating

### Main:

* 2 column responsive grid
* Hotel card:
  * Image
  * Name
  * Stars
  * Reviews
  * Amenities tags
  * Price
  * CTA

---

## 🏨 3. Hotel Detail Page

* Big gallery header
* Title + stars
* Description
* Amenities grid
* Booking card on right side
* Sticky booking panel

---

## 🧾 4. Booking Flow

Steps:

1. Select room
2. Enter personal info
3. Payment (fake for school)
4. Confirmation page

---

## 👤 5. My Bookings

* List of bookings
* Status badge:
  * Confirmed (green)
  * Pending (yellow)
  * Cancelled (red)
* Cancel button
* View details

---

## 🔐 6. Login / Register

Visual style:

* Same sky background
* Centered card
* Glassy white form
* Gradient button
* Rounded inputs

---

# 🛠 Technická implementácia (podľa tvojho Projekt.md)

Podľa checklistu z tvojho projektu Projekt

:

Musíme mať:

* Vue frontend
* Hono backend
* Autentifikáciu (cookies)
* Role (user, admin)
* CRUD (hotels, bookings)
* Admin dashboard
* Validáciu
* Bezpečnosť

---

# 🧠 UI Component System

Znovupoužiteľné komponenty:

* <AppNavbar />
* <SearchBar />
* <HotelCard />
* <FilterSidebar />
* <BookingCard />
* <FormInput />
* <PrimaryButton />
* <StatusBadge />

---

# 📱 Responsivita

Desktop:

* Sidebar + grid

Tablet:

* Sidebar collapsible

Mobile:

* Filters ako modal
* 1 column grid

---

# 🎯 Dizajnový cieľ

Hotelex má pôsobiť ako:

* Premium
* Modern
* Clean
* Soft
* Light
* Trustworthy

Nie:

* Tmavý
* Brutalist
* Preplácaný
* Gaming vibe
