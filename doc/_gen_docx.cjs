const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak,
} = require("docx");

// ── helpers ──────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function p(text, opts = {}) {
  const runs = [];
  // simple bold/code inline parser
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Arial", size: 22 }));
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(new TextRun({ text: part.slice(1, -1), font: "Consolas", size: 20, color: "C7254E",
        shading: { type: ShadingType.CLEAR, fill: "F9F2F4" } }));
    } else if (part) {
      runs.push(new TextRun({ text: part, font: "Arial", size: 22, ...opts }));
    }
  }
  return new Paragraph({ spacing: { after: 120 }, children: runs });
}

function heading(text, level) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 160 },
    children: [new TextRun({ text, font: "Arial", bold: true,
      size: level === HeadingLevel.HEADING_1 ? 36 : level === HeadingLevel.HEADING_2 ? 30 : 26 })],
  });
}

function codeBlock(lines) {
  return lines.map((line) =>
    new Paragraph({
      spacing: { after: 0, line: 276 },
      shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
      indent: { left: 200 },
      children: [new TextRun({ text: line || " ", font: "Consolas", size: 18, color: "333333" })],
    })
  );
}

function bullet(text, ref = "bullets") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Arial", size: 22 }));
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(new TextRun({ text: part.slice(1, -1), font: "Consolas", size: 20, color: "C7254E" }));
    } else if (part) {
      runs.push(new TextRun({ text: part, font: "Arial", size: 22 }));
    }
  }
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 }, children: runs });
}

function numberedItem(text, ref = "numbers") {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Arial", size: 22 }));
    } else if (part.startsWith("`") && part.endsWith("`")) {
      runs.push(new TextRun({ text: part.slice(1, -1), font: "Consolas", size: 20, color: "C7254E" }));
    } else if (part) {
      runs.push(new TextRun({ text: part, font: "Arial", size: 22 }));
    }
  }
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 80 }, children: runs });
}

function tableRow(cells, header = false) {
  return new TableRow({
    children: cells.map((text, i) => {
      const widths = [1200, 2600, 3000, 2560];
      return new TableCell({
        borders,
        width: { size: widths[i] || 2340, type: WidthType.DXA },
        margins: cellMargins,
        shading: header ? { type: ShadingType.CLEAR, fill: "E8EAF6" } : undefined,
        children: [new Paragraph({
          children: [new TextRun({ text, font: "Arial", size: 20, bold: header })],
        })],
      });
    }),
  });
}

// ── document ─────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers4",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "numbers5",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets2",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
      {
        reference: "bullets3",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
      },
    },
    children: [
      // ── TITLE ──
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: "Hotelex Backend - Complete Guide", font: "Arial", size: 44, bold: true, color: "1A237E" })],
      }),
      p("Tento guide ti vysvetli kazdy backend subor, co robi, preco, a ako to cele funguje dohromady."),

      // ── 1. VELKY OBRAZOK ──
      heading("1. Ako to cele funguje (velky obrazok)", HeadingLevel.HEADING_1),
      ...codeBlock([
        "BROWSER (Vue frontend, port 5173)",
        "    |",
        "    |  HTTP requesty (GET, POST, PUT, DELETE)",
        "    |  posiela JSON data + cookie",
        "    |",
        "    v",
        "HONO BACKEND (Node.js server, port 3000)",
        "    |",
        "    |  SQL queries (SELECT, INSERT, UPDATE)",
        "    |",
        "    v",
        "MYSQL DATABAZA (XAMPP, port 3306)",
      ]),
      p("Frontend posle request na backend (napr. \"daj mi vsetky hotely\"). Backend spusti SQL query v databaze, dostane data, a posle ich spat ako JSON."),

      // ── 2. XAMPP ──
      heading("2. XAMPP a MySQL - ako to funguje", HeadingLevel.HEADING_1),
      heading("Co je XAMPP?", HeadingLevel.HEADING_3),
      p("XAMPP je program ktory ti na PC spusti MySQL databazu. Ked otvoris XAMPP Control Panel a kliknes \"Start\" pri MySQL, spusti sa databazovy server na porte 3306."),
      heading("Ako sa backend pripaja?", HeadingLevel.HEADING_3),
      p("V subore `db.ts` (riadok 4-12):"),
      ...codeBlock([
        "export const pool = mysql.createPool({",
        "  host: 'localhost',      // databaza bezi na tvojom PC",
        "  user: 'root',           // default XAMPP user",
        "  password: '',           // default XAMPP nema heslo",
        "  database: 'hotelex',    // nazov databazy",
        "  port: 3306,             // default MySQL port",
        "  connectionLimit: 10,    // max 10 sucasnych pripojeni",
        "})",
      ]),
      p("`pool` je \"connection pool\" - miesto z ktoreho si backend berie pripojenie na databazu ked potrebuje spravit query. Netvori sa nove pripojenie pri kazdom requeste, ale znovu pouziva existujuce - to je rychlejsie."),
      heading("Ako vznikla databaza?", HeadingLevel.HEADING_3),
      numberedItem("V phpMyAdmin si vytvoril databazu `hotelex`"),
      numberedItem("Spustil si `schema.sql` - to vytvorilo vsetky tabulky (users, hotels, rooms, bookings, atd.)"),
      numberedItem("Spustil si `seed.sql` - to naplnilo tabulky testovacimi datami (admin user, 6 hotelov, izby, amenities)"),

      // ── 3. SUBORY ──
      heading("3. Subory backendu - prehled", HeadingLevel.HEADING_1),
      ...codeBlock([
        "hono-backend/src/",
        "  index.ts       <- Hlavny subor. Tu su vsetky API endpointy (routy).",
        "  db.ts          <- Vsetky SQL queries.",
        "  auth.ts        <- Login, register, logout endpointy.",
        "  middleware.ts  <- Funkcie ktore kontroluju ci je user prihlaseny / ci je admin.",
      ]),

      // ── 4. DB.TS ──
      new Paragraph({ children: [new PageBreak()] }),
      heading("4. db.ts - Databazove queries (podrobne)", HeadingLevel.HEADING_1),
      p("Tento subor obsahuje VSETKY SQL dotazy. Kazda skupina je objekt s async funkciami."),

      heading("userQueries", HeadingLevel.HEADING_3),
      p("**`create(name, email, passwordHash, role, createdAt)`**"),
      bullet("Pouziva TRANSACTION - spravi 2 INSERTy (do `users` a `user_profiles`) naraz. Ak jeden zlyha, druhy sa tiez zrusi (rollback)."),
      ...codeBlock([
        "INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, ?)",
        "INSERT INTO user_profiles (user_id, display_name, created_at) VALUES (?, ?, ?)",
      ]),
      p("Otazniky `?` su **prepared statements** - chrani pred SQL injection. Databaza dostane zvlast query a zvlast data, takze nikto nemoze vlozit skodlivy SQL cez input."),
      p("**`findByEmail(email)`** - Pouziva JOIN - spaja tabulku `users` s `user_profiles` aby dostal aj meno aj email v jednom dotaze. `WHERE u.deleted_at IS NULL` ignoruje \"zmazanych\" userov (soft delete)."),
      p("**`findById(id)`** - to iste ako findByEmail ale hlada podla ID."),

      heading("sessionQueries", HeadingLevel.HEADING_3),
      bullet("**`create(token, userId, expiresAt, createdAt)`** - ulozi novu session do DB."),
      bullet("**`findByToken(token)`** - najde session podla tokenu, ale len ak este nevyprsal (`expires_at > NOW()`)."),
      bullet("**`deleteByToken(token)`** - zmaze session (pri logoutu)."),

      heading("hotelQueries", HeadingLevel.HEADING_3),
      p("**`findAll(filters)`** - najkomplexnejsi query. Robi toto:"),
      numberedItem("Vyberie vsetky hotely ktore nie su zmazane", "numbers2"),
      numberedItem("JOINne rooms aby dostal najnizsiu cenu (`MIN(r.price_per_night)`)", "numbers2"),
      numberedItem("JOINne amenities aby dostal zoznam vybavenia", "numbers2"),
      numberedItem("Ak su filtre (mesto, cena, guests), prida WHERE/HAVING podmienky", "numbers2"),
      numberedItem("`GROUP BY h.id` - zgrupi vysledky po hoteloch", "numbers2"),
      p("**`findById(id)`** - jednoducky SELECT jedneho hotela."),

      heading("bookingQueries", HeadingLevel.HEADING_3),
      bullet("**`create(...)`** - INSERT novej rezervacie so statusom 'confirmed'.", "bullets2"),
      bullet("**`findByUser(userId)`** - SELECT vsetkych bookingov daneho usera. Pouziva JOINy aby dostal aj meno hotela, izby, a pocet noci (`DATEDIFF`).", "bullets2"),
      bullet("**`cancel(id, userId)`** - UPDATE statusu na 'cancelled'. Podmienka `AND user_id = ?` zaruci ze user moze zrusit len SVOJU rezervaciu.", "bullets2"),

      heading("adminQueries", HeadingLevel.HEADING_3),
      bullet("**`getStats()`** - 3x `SELECT COUNT(*)` - spocita hotely, userov, a bookingy.", "bullets3"),
      bullet("**`getAllBookings()`** - Podobne ako `findByUser` ale bez WHERE na user_id - admin vidi VSETKO.", "bullets3"),
      bullet("**`createHotel / updateHotel / deleteHotel`** - CRUD operacie. deleteHotel robi SOFT DELETE (`SET deleted_at = NOW()`) - hotel sa nezmaze fyzicky.", "bullets3"),
      bullet("**`updateUserRole(userId, role)`** - zmeni rolu usera (user/admin).", "bullets3"),

      // ── 5. AUTH.TS ──
      new Paragraph({ children: [new PageBreak()] }),
      heading("5. auth.ts - Autentifikacia (podrobne)", HeadingLevel.HEADING_1),

      heading("Ako funguje registracia? (POST /auth/register)", HeadingLevel.HEADING_3),
      ...codeBlock([
        "1. Prijme JSON: { name, email, password }",
        "2. ZOD VALIDACIA - skontroluje ci email ma spravny format, ci heslo ma min 6 znakov",
        "3. Skontroluje ci uz existuje user s takym emailom",
        "4. HASHUJE heslo pomocou bcrypt (heslo sa NIKDY neuklada ako text!)",
        "5. Ulozi usera do DB s rolou 'user'",
        "6. Vrati { ok: true }",
      ]),

      p("**Co je bcrypt hash?** Ked user zada heslo \"ahoj123\", bcrypt z neho spravi nieco ako `$2a$10$MgFWKh56Buc3D1...` - dlhy nahodny string. Z hashu sa neda ziskat povodne heslo. Pri logine bcrypt porovna heslo s hashom."),

      heading("Ako funguje login? (POST /auth/login)", HeadingLevel.HEADING_3),
      ...codeBlock([
        "1. Prijme JSON: { email, password }",
        "2. Najde usera v DB podla emailu",
        "3. Porovna zadane heslo s hashom v DB (bcrypt.compare)",
        "4. Ak sedi:",
        "   a) Vytvori SESSION TOKEN (nahodny UUID)",
        "   b) Ulozi token do tabulky sessions (s expiraciou 7 dni)",
        "   c) Posle token ako COOKIE v response",
        "5. Vrati { ok: true, user: { id, name, email, role } }",
      ]),

      p("**Co je cookie a preco ju pouzivame?** Cookie je maly kusok dat ktory browser AUTOMATICKY posiela s kazdym requestom na ten isty server. Takze po logine:"),
      bullet("Browser dostane cookie `session=a3f4b2c1-...`"),
      bullet("Pri KAZDOM dalsom requeste browser automaticky posle tuto cookie"),
      bullet("Backend precita cookie, najde session v DB, a vie kto je prihlaseny"),

      p("Cookie ma nastavenia:"),
      bullet("`httpOnly: true` - JavaScript na frontende NEMOZE citat tuto cookie (ochrana pred XSS)"),
      bullet("`sameSite: 'Lax'` - cookie sa neposle z inych stranok (ochrana pred CSRF)"),
      bullet("`maxAge: 7 dni` - po 7 dnoch sa cookie automaticky zmaze"),

      heading("Ako funguje logout? (POST /auth/logout)", HeadingLevel.HEADING_3),
      numberedItem("Precita session cookie", "numbers3"),
      numberedItem("Zmaze session z DB", "numbers3"),
      numberedItem("Zmaze cookie z browsera", "numbers3"),

      heading("Ako funguje /auth/me? (GET /auth/me)", HeadingLevel.HEADING_3),
      p("Frontendova appka vola tento endpoint po KAZDOM refreshi stranky. Ak je cookie platna, vrati uzivatela. Ak nie, vrati `{ user: null }`. Takto sa session zachova aj po reloade."),

      // ── 6. MIDDLEWARE ──
      heading("6. middleware.ts - Ochrana endpointov", HeadingLevel.HEADING_1),
      p("Middleware je funkcia ktora sa spusti PRED tvojim endpointom. Ak kontrola zlyha, request sa zastavi a endpoint sa nespusti."),

      heading("requireAuth", HeadingLevel.HEADING_3),
      ...codeBlock([
        "1. Precita cookie \"session\" z requestu",
        "2. Ak nie je cookie -> vrati 401 (Not authenticated)",
        "3. Najde session v DB podla tokenu",
        "4. Ak session neexistuje alebo vyprsal -> vrati 401",
        "5. Najde usera podla session.user_id",
        "6. Ak user neexistuje -> vrati 401",
        "7. Pripravi user data do contextu (c.set('user', ...))",
        "8. Pusti request dalej (await next())",
      ]),

      heading("requireAdmin", HeadingLevel.HEADING_3),
      ...codeBlock([
        "1. Precita usera z contextu (ktoreho tam dal requireAuth)",
        "2. Ak user.role !== 'admin' -> vrati 403 (Admin access required)",
        "3. Ak je admin -> pusti dalej",
      ]),

      heading("Ako sa middleware pouziva v index.ts:", HeadingLevel.HEADING_3),
      ...codeBlock([
        "// Kazdy moze vidiet hotely - ziadny middleware",
        "app.get('/hotels', async (c) => { ... })",
        "",
        "// Len prihlaseny user moze vytvorit booking",
        "app.post('/bookings', requireAuth, async (c) => { ... })",
        "",
        "// Len admin moze vytvorit hotel - OBA middleware za sebou",
        "app.post('/admin/hotels', requireAuth, requireAdmin, async (c) => { ... })",
      ]),

      // ── 7. INDEX.TS ──
      new Paragraph({ children: [new PageBreak()] }),
      heading("7. index.ts - Vsetky API endpointy", HeadingLevel.HEADING_1),
      p("Toto je hlavny subor. Hono je web framework - podobne ako Express, ale modernejsi a jednoduchsi."),

      heading("Zakladna struktura endpointu:", HeadingLevel.HEADING_3),
      ...codeBlock([
        "app.get('/hotels', async (c) => {",
        "//  ^^^ HTTP metoda (GET/POST/PUT/DELETE)",
        "//       ^^^^^^^^ URL cesta",
        "//                      ^ c = context (request + response)",
        "  const hotels = await hotelQueries.findAll()  // zavolaj DB",
        "  return c.json(hotels)                         // vrat JSON response",
        "})",
      ]),

      heading("Vsetky endpointy:", HeadingLevel.HEADING_3),
      new Table({
        width: { size: 9506, type: WidthType.DXA },
        columnWidths: [1200, 2600, 3000, 2706],
        rows: [
          tableRow(["Metoda", "URL", "Middleware", "Co robi"], true),
          tableRow(["POST", "/auth/register", "-", "Registracia noveho usera"]),
          tableRow(["POST", "/auth/login", "-", "Prihlasenie, vytvori cookie"]),
          tableRow(["POST", "/auth/logout", "-", "Odhlasenie, zmaze session"]),
          tableRow(["GET", "/auth/me", "-", "Vrati aktualneho usera"]),
          tableRow(["GET", "/hotels", "-", "Zoznam hotelov (s filtrami)"]),
          tableRow(["GET", "/hotels/:id", "-", "Detail jedneho hotela"]),
          tableRow(["GET", "/hotels/:id/rooms", "-", "Izby daneho hotela"]),
          tableRow(["POST", "/bookings", "requireAuth", "Vytvor rezervaciu"]),
          tableRow(["GET", "/bookings/my", "requireAuth", "Moje rezervacie"]),
          tableRow(["PUT", "/bookings/:id/cancel", "requireAuth", "Zrus moju rezervaciu"]),
          tableRow(["GET", "/admin/stats", "Auth + Admin", "Statistiky (pocty)"]),
          tableRow(["GET", "/admin/hotels", "Auth + Admin", "Vsetky hotely"]),
          tableRow(["POST", "/admin/hotels", "Auth + Admin", "Pridaj hotel"]),
          tableRow(["PUT", "/admin/hotels/:id", "Auth + Admin", "Uprav hotel"]),
          tableRow(["DELETE", "/admin/hotels/:id", "Auth + Admin", "Zmaz hotel (soft)"]),
          tableRow(["GET", "/admin/bookings", "Auth + Admin", "Vsetky bookingy"]),
          tableRow(["GET", "/admin/users", "Auth + Admin", "Vsetci useri"]),
          tableRow(["PUT", "/admin/users/:id/role", "Auth + Admin", "Zmen rolu usera"]),
        ],
      }),

      p(""),
      heading("CORS konfiguracia", HeadingLevel.HEADING_3),
      ...codeBlock([
        "app.use(cors({",
        "  origin: 'http://localhost:5173',  // povoleny len frontend",
        "  credentials: true,                // povol posielanie cookies",
        "}))",
      ]),
      p("Bez CORS by browser BLOKOVAL requesty z frontendu (port 5173) na backend (port 3000) pretoze su na roznych portoch."),

      // ── 8. DB MODEL ──
      heading("8. Databazovy model (tabulky a vztahy)", HeadingLevel.HEADING_1),
      ...codeBlock([
        "users  --1:1--  user_profiles     (kazdy user ma 1 profil)",
        "users  --1:N--  sessions          (user moze mat viac sessions)",
        "users  --1:N--  hotels            (admin vytvara hotely - created_by)",
        "hotels --1:N--  rooms             (hotel ma viac izieb)",
        "rooms  --N:M--  amenities         (cez tabulku room_amenities)",
        "users  --1:N--  bookings          (user ma viac rezervacii)",
        "rooms  --1:N--  bookings          (izba ma viac rezervacii)",
      ]),

      heading("Klucove tabulky:", HeadingLevel.HEADING_3),
      p("**users** - id, email, password_hash, role ('user'/'admin'), deleted_at"),
      p("**sessions** - token (UUID), user_id, expires_at"),
      p("**hotels** - id, name, city, address, description, created_by (FK na users)"),
      p("**rooms** - id, hotel_id (FK), room_type_id (FK), name, capacity, beds, price_per_night"),
      p("**bookings** - id, user_id (FK), room_id (FK), check_in, check_out, guests, status, cancelled_at"),
      p("FK = Foreign Key = cudzii kluc = odkazuje na iny riadok v inej tabulke."),

      // ── 9. SECURITY ──
      heading("9. Bezpecnost - co je v kode implementovane", HeadingLevel.HEADING_1),
      numberedItem("**Hesla su hashovane** (bcrypt) - nikdy sa neukladaju ako text", "numbers4"),
      numberedItem("**Prepared statements** (`?` v SQL) - ochrana pred SQL injection", "numbers4"),
      numberedItem("**HttpOnly cookies** - JavaScript nemoze precitat session cookie", "numbers4"),
      numberedItem("**SameSite: Lax** - CSRF ochrana", "numbers4"),
      numberedItem("**CORS** - len frontend na localhost:5173 moze volat API", "numbers4"),
      numberedItem("**Role-based access** - middleware kontroluje ci je user admin", "numbers4"),
      numberedItem("**Ownership check** - user moze zrusit len SVOJU rezervaciu", "numbers4"),
      numberedItem("**Soft delete** - hotely sa nemazu fyzicky, zachovava sa historia", "numbers4"),
      numberedItem("**Zod validacia** - vstupne data sa validuju pred spracovanim", "numbers4"),

      // ── 10. FLOW ──
      new Paragraph({ children: [new PageBreak()] }),
      heading("10. Cely flow - co sa deje ked user spravi booking", HeadingLevel.HEADING_1),
      ...codeBlock([
        "1. User otvori /hotel/3 v browseri",
        "   -> Frontend posle GET http://localhost:3000/hotels/3",
        "   -> Backend spusti: SELECT * FROM hotels WHERE id = 3",
        "   -> Vrati JSON s datami hotela",
        "",
        "2. Frontend posle GET http://localhost:3000/hotels/3/rooms",
        "   -> Backend spusti: SELECT rooms + JOIN room_types + JOIN amenities",
        "   -> Vrati JSON so vsetkymi izbami",
        "",
        "3. User klikne \"Book Now\", vyplni datumy, klikne \"Confirm\"",
        "   -> Frontend posle POST http://localhost:3000/bookings",
        "      s JSON: { roomId: 5, checkIn: \"2026-04-01\", ... }",
        "      + cookie \"session=abc-123\"",
        "",
        "4. Backend middleware (requireAuth):",
        "   -> Precita cookie \"session=abc-123\"",
        "   -> SELECT * FROM sessions WHERE token = 'abc-123'",
        "   -> Najde session -> SELECT user WHERE id = session.user_id",
        "   -> Prida usera do contextu",
        "",
        "5. Backend endpoint:",
        "   -> Precita JSON body",
        "   -> Validuje (check-out musi byt po check-in)",
        "   -> INSERT INTO bookings (...) VALUES (...)",
        "",
        "6. Backend vrati { ok: true }",
        "   -> Frontend presmeruje na /my-bookings",
        "   -> Frontend posle GET /bookings/my (s cookie)",
        "   -> Backend SELECT bookings JOIN rooms JOIN hotels",
        "   -> Frontend zobrazi booking",
      ]),

      // ── 11. SPUSTENIE ──
      heading("11. Ako spustit projekt", HeadingLevel.HEADING_1),
      numberedItem("Spusti XAMPP -> Start MySQL", "numbers5"),
      numberedItem("Terminal 1: `cd hono-backend && npm run dev` (spusti backend na porte 3000)", "numbers5"),
      numberedItem("Terminal 2: `cd hono-client && npm run dev` (spusti frontend na porte 5173)", "numbers5"),
      numberedItem("Otvor http://localhost:5173", "numbers5"),

      heading("Ako sa stat adminom:", HeadingLevel.HEADING_3),
      bullet("Login ako `admin@hotelex.sk` / `admin123` (seed data)"),
      bullet("Alebo v phpMyAdmin: `UPDATE users SET role = 'admin' WHERE email = 'tvoj@email.com';` a potom sa odhlasit a znova prihlasit"),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("BACKEND_GUIDE.docx", buffer);
  console.log("Created doc/BACKEND_GUIDE.docx");
});
