const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, Header, Footer, ExternalHyperlink
} = require('docx');
const fs = require('fs');

// ─── Helpers ────────────────────────────────────────────────────────────────

const PURPLE  = '6D28D9';
const LBLUE   = 'EDE9FE';
const LGRAY   = 'F3F4F6';
const DGRAY   = '374151';
const GREEN   = '065F46';
const LGREEN  = 'ECFDF5';
const ORANGE  = '92400E';
const LORANGE = 'FFFBEB';
const RED     = '991B1B';
const LRED    = 'FEF2F2';
const WHITE   = 'FFFFFF';

const cellBorder = (color = 'D1D5DB') => ({
  top:    { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left:   { style: BorderStyle.SINGLE, size: 1, color },
  right:  { style: BorderStyle.SINGLE, size: 1, color },
});

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, color: PURPLE, font: 'Arial' })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: DGRAY, font: 'Arial' })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: DGRAY, font: 'Arial' })],
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: DGRAY, ...opts })],
  });
}

function bold(text) {
  return new TextRun({ text, bold: true, size: 22, font: 'Arial', color: DGRAY });
}

function code(text) {
  return new TextRun({ text, font: 'Courier New', size: 18, color: '1E40AF', highlight: 'cyan' });
}

function mixedPara(...runs) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: runs,
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: DGRAY })],
  });
}

function bulletMixed(runs, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 60, after: 60 },
    children: runs,
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'numbered', level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: 'Arial', color: DGRAY })],
  });
}

function codeBlock(lines) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: cellBorder('6B7280'),
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: '1F2937', type: ShadingType.CLEAR },
        margins: { top: 160, bottom: 160, left: 240, right: 240 },
        children: lines.map(line =>
          new Paragraph({
            spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: line, font: 'Courier New', size: 18, color: 'A5F3FC' })],
          })
        ),
      })],
    })],
  });
}

function infoBox(title, lines, fill = LBLUE, titleColor = PURPLE) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders: cellBorder(PURPLE),
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: [
          new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [new TextRun({ text: title, bold: true, size: 22, font: 'Arial', color: titleColor })],
          }),
          ...lines.map(l => new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [new TextRun({ text: l, size: 21, font: 'Arial', color: DGRAY })],
          })),
        ],
      })],
    })],
  });
}

function twoColTable(headers, rows, colWidths = [2000, 7360]) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      borders: cellBorder('9CA3AF'),
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: '4C1D95', type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, size: 20, font: 'Arial', color: WHITE })],
      })],
    })),
  });
  const dataRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => new TableCell({
      borders: cellBorder('D1D5DB'),
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: 'FAFAFA', type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 160, right: 160 },
      children: [new Paragraph({
        children: typeof cell === 'string'
          ? [new TextRun({ text: cell, size: 20, font: 'Arial', color: DGRAY })]
          : cell,
      })],
    })),
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows],
  });
}

function spacer() {
  return new Paragraph({ spacing: { before: 120, after: 0 }, children: [new TextRun('')] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
    children: [new TextRun('')],
  });
}

function pageBreak() {
  return new Paragraph({ pageBreakBefore: true, children: [new TextRun('')] });
}

// ─── Document ───────────────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 300 } } } },
        ],
      },
      {
        reference: 'numbered',
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 22, color: DGRAY } },
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: PURPLE },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: DGRAY },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: DGRAY },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
          children: [new TextRun({ text: 'Hotelex — Study Guide', size: 18, font: 'Arial', color: '9CA3AF' })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
          children: [
            new TextRun({ text: 'Page ', size: 18, font: 'Arial', color: '9CA3AF' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Arial', color: '9CA3AF' }),
          ],
        })],
      }),
    },
    children: [

      // ══════════════════════════════════════════════════
      // TITLE PAGE
      // ══════════════════════════════════════════════════
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1200, after: 200 },
        children: [new TextRun({ text: 'HOTELEX', bold: true, size: 72, font: 'Arial', color: PURPLE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 160 },
        children: [new TextRun({ text: 'Full-Stack Project — Study Guide', size: 32, font: 'Arial', color: '6B7280' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 600 },
        children: [new TextRun({ text: 'Everything you need to understand, explain & present', size: 24, font: 'Arial', color: '9CA3AF', italics: true })],
      }),
      spacer(),
      twoColTable(['', ''], [
        ['\u{1F3E8} App', 'Hotel booking platform with 3 roles: Guest, Owner, Admin'],
        ['⚡ Backend', 'Hono (TypeScript) + MySQL — 4 files, ~600 lines'],
        ['\u{1F5A5} Frontend', 'Vue 3 + Pinia + Vue Router + Tailwind CSS'],
        ['\u{1F4E1} Realtime', 'SSE (Server-Sent Events) for live admin notifications'],
        ['\u{1F511} Auth', 'Session cookies + bcrypt + role-based middleware'],
      ], [1800, 7560]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 1 — PROJECT OVERVIEW
      // ══════════════════════════════════════════════════
      h1('1. Project Overview'),
      p('Hotelex is a hotel booking platform. Guests browse and book rooms, hotel owners manage their listings (which go through admin approval), and the admin oversees everything.'),
      spacer(),

      h2('1.1 User Roles'),
      twoColTable(['Role', 'What they can do'], [
        ['guest (user)', 'Browse hotels, search with filters, book rooms, cancel bookings, delete account'],
        ['owner', 'Create hotels (sent to approval queue), manage rooms/amenities/images, accept or reject guest bookings'],
        ['admin', 'Approve/reject hotel listings, manage all users, change roles, view all bookings, get live SSE notifications'],
      ], [2000, 7360]),
      spacer(),

      h2('1.2 Tech Stack'),
      twoColTable(['Layer', 'Technology & why'], [
        ['Backend framework', 'Hono — lightweight, fast, TypeScript-first HTTP framework (similar to Express but modern)'],
        ['Database', 'MySQL with raw SQL queries — all queries live in db.ts'],
        ['Password hashing', 'bcryptjs — one-way hashing, impossible to reverse'],
        ['Validation', 'Zod — schema validation library for TypeScript'],
        ['Frontend framework', 'Vue 3 with Composition API (<script setup>)'],
        ['State management', 'Pinia — Vue\'s official store (replaces Vuex)'],
        ['Routing', 'Vue Router 4 — SPA routing with navigation guards'],
        ['Styling', 'Tailwind CSS — utility-first CSS'],
      ], [2400, 6960]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 2 — BACKEND ARCHITECTURE
      // ══════════════════════════════════════════════════
      h1('2. Backend Architecture'),
      p('The backend is split into exactly 4 files. Each file has one clear responsibility — this is called "separation of concerns".'),
      spacer(),

      twoColTable(['File', 'Responsibility'], [
        ['index.ts', 'All HTTP routes — maps URLs to actions. The entry point.'],
        ['middleware.ts', 'Authentication guards — blocks unauthorized requests before they reach route handlers.'],
        ['auth.ts', 'Registration, login, logout logic — creates and destroys sessions.'],
        ['db.ts', 'All SQL queries — the only file that talks to the database.'],
      ], [2000, 7360]),
      spacer(),

      h2('2.1 How a Request Flows'),
      p('Every HTTP request goes through the same pipeline:'),
      spacer(),
      codeBlock([
        'Browser sends:  POST /bookings  (with session cookie)',
        '',
        '  1. CORS middleware     → Is this from an allowed origin?',
        '  2. requireAuth         → Is the session cookie valid? Load user.',
        '  3. Route handler       → Parse body, call db.ts function',
        '  4. bookingQueries.create() → Run SQL INSERT',
        '  5. Return JSON         → { id: 42, status: "pending" }',
      ]),
      spacer(),

      h2('2.2 index.ts — The Router'),
      p('index.ts defines all API endpoints. The pattern is always the same:'),
      spacer(),
      codeBlock([
        '// Public endpoint — no auth needed',
        'app.get(\'/hotels\', async (c) => {',
        '  const filters = c.req.query()         // read query string params',
        '  const results = await hotelQueries.findAll(filters)  // call db.ts',
        '  return c.json(results)                // send JSON response',
        '})',
        '',
        '// Protected endpoint — user must be logged in',
        'app.post(\'/bookings\', requireAuth, async (c) => {',
        '  const user = c.get(\'user\')            // set by middleware',
        '  const body = await c.req.json()       // parse request body',
        '  const booking = await bookingQueries.create({ ...body, userId: user.id })',
        '  return c.json(booking, 201)',
        '})',
        '',
        '// Owner-only endpoint',
        'app.put(\'/owner/hotels/:id\', requireOwner, async (c) => { ... })',
        '',
        '// Admin-only endpoint',
        'app.delete(\'/admin/hotels/:id\', requireAdmin, async (c) => { ... })',
      ]),
      spacer(),

      h2('2.3 middleware.ts — The Bouncer'),
      p('Three middleware functions that run before route handlers:'),
      spacer(),
      codeBlock([
        'requireAuth:',
        '  1. Read session token from cookie: c.req.header(\'Cookie\')',
        '  2. Look up token in sessions table: SELECT * FROM sessions WHERE token = ?',
        '  3. If not found or expired → return 401 Unauthorized',
        '  4. Load user from users table',
        '  5. Attach to context: c.set(\'user\', user)',
        '  6. Call next() — continue to route handler',
        '',
        'requireOwner:',
        '  1. Run requireAuth first',
        '  2. Check if user.role === \'owner\'',
        '  3. If not → return 403 Forbidden',
        '',
        'requireAdmin:',
        '  1. Run requireAuth first',
        '  2. Check if user.role === \'admin\'',
        '  3. If not → return 403 Forbidden',
      ]),
      spacer(),
      infoBox('Key concept: 401 vs 403', [
        '401 Unauthorized — You are not logged in (no valid session)',
        '403 Forbidden — You are logged in, but you do not have permission',
      ]),
      spacer(),

      h2('2.4 db.ts — The Database Layer'),
      p('All SQL queries are in db.ts, organized into groups by feature:'),
      spacer(),
      twoColTable(['Query group', 'What it contains'], [
        ['userQueries', 'Create user (transaction: users + user_profiles), find by email/ID, soft delete'],
        ['sessionQueries', 'Create session token, find by token (check expiry), delete on logout'],
        ['hotelQueries', 'Public search with filters + availability check, full hotel detail, booked dates'],
        ['bookingQueries', 'Create booking, list by user/hotel, accept/reject (owner), cancel (guest)'],
        ['ownerQueries', 'Create hotel (status=pending), update, delete, manage rooms/amenities/images'],
        ['adminQueries', 'Stats, approve/reject hotels, manage users and roles'],
        ['fileQueries', 'Store file metadata (path, size, mime type, uploader)'],
      ], [2200, 7160]),
      spacer(),

      infoBox('What is a database transaction?', [
        'When creating a user, we need to insert into TWO tables: users and user_profiles.',
        'A transaction means: either BOTH inserts succeed, or NEITHER does.',
        'Without transactions: if the second insert fails, you get a half-created user with no profile.',
        'In code: await db.beginTransaction() ... await db.commit() ... catch: await db.rollback()',
      ], LGREEN, GREEN),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 3 — AUTHENTICATION
      // ══════════════════════════════════════════════════
      h1('3. Authentication & Sessions'),
      p('Authentication answers: "Who are you?" Sessions answer: "Are you still you after refreshing the page?"'),
      spacer(),

      h2('3.1 Registration Flow'),
      numbered('User submits: name, email, password, role (guest/owner)'),
      numbered('Zod validates the data: email format, password min 6 chars, valid role'),
      numbered('Check if email already exists in the database'),
      numbered('Hash the password: bcrypt.hash(password, 10) — this takes ~100ms on purpose'),
      numbered('Insert into users table (hashed password) + user_profiles table (name) in a transaction'),
      numbered('Return success message — user must now log in'),
      spacer(),

      codeBlock([
        '// What bcrypt actually stores in the database:',
        'plaintext password:   "mypassword123"',
        'stored in database:   "$2b$10$K8Zx9...8Ja3k" (60-char hash)',
        '',
        '// The 10 = salt rounds. Higher = slower to crack but slower to compute.',
        '// Even if someone steals your database, they cannot get the original passwords.',
      ]),
      spacer(),

      h2('3.2 Login Flow'),
      numbered('User submits: email + password'),
      numbered('Find user by email in database'),
      numbered('Compare password with hash: await bcrypt.compare(password, user.password_hash)'),
      numbered('If mismatch → return 401 "Invalid credentials"'),
      numbered('Create a session: generate UUID token, set expiry to 7 days from now'),
      numbered('Save token to sessions table: INSERT INTO sessions (token, user_id, expires_at)'),
      numbered('Set httpOnly cookie: Set-Cookie: session=<token>; HttpOnly; Path=/'),
      numbered('Return user object (id, name, email, role) — never the password hash'),
      spacer(),

      infoBox('What is an httpOnly cookie?', [
        'A cookie that JavaScript CANNOT read (document.cookie will not show it).',
        'This protects against XSS attacks — malicious scripts cannot steal the token.',
        'The browser sends it automatically with every request to the same domain.',
        'Only the server can set and read it via HTTP headers.',
      ]),
      spacer(),

      h2('3.3 Session Validation (on every protected request)'),
      codeBlock([
        '1. Browser automatically sends:  Cookie: session=abc-uuid-123',
        '2. middleware.ts reads the cookie value',
        '3. SELECT * FROM sessions WHERE token = "abc-uuid-123"',
        '4. Check: does the session exist AND is expires_at > NOW()?',
        '5. If yes: SELECT * FROM users WHERE id = session.user_id',
        '6. Attach user to request context',
        '7. Route handler runs with access to c.get("user")',
      ]),
      spacer(),

      h2('3.4 Logout'),
      p('DELETE FROM sessions WHERE token = <current_token>, then clear the cookie by setting it to empty with expiry in the past.'),
      spacer(),

      h2('3.5 Delete Account'),
      p('Soft delete — the user record is NOT removed from the database. Instead, deleted_at is set to NOW(). This cascades to:'),
      bullet('Sessions: DELETE FROM sessions WHERE user_id = ?'),
      bullet('Hotels (if owner): SET deleted_at = NOW() on all their hotels'),
      bullet('Bookings: stay in place for history/audit trail'),
      spacer(),
      infoBox('Hard delete vs Soft delete', [
        'Hard delete: DELETE FROM users WHERE id = ? — row is gone forever',
        'Soft delete: UPDATE users SET deleted_at = NOW() WHERE id = ?',
        'Soft delete is safer: you keep history, can restore data, and avoid broken foreign keys.',
        'Queries then filter: WHERE deleted_at IS NULL to only show "active" records.',
      ]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 4 — DATABASE DESIGN
      // ══════════════════════════════════════════════════
      h1('4. Database Design'),

      h2('4.1 Core Tables'),
      twoColTable(['Table', 'Key columns & purpose'], [
        ['users', 'id, email, password_hash, role (user/owner/admin), deleted_at'],
        ['user_profiles', 'user_id (FK), name — 1:1 with users, separated for extensibility'],
        ['sessions', 'token (UUID), user_id (FK), expires_at — one row per active login'],
        ['hotels', 'id, name, city, address, description, status (pending/approved/rejected), created_by (FK users), deleted_at'],
        ['rooms', 'id, hotel_id (FK), name, type_id (FK), capacity, beds, price_per_night'],
        ['bookings', 'id, room_id (FK), user_id (FK), check_in, check_out, guests, status (pending/confirmed/rejected/cancelled)'],
        ['amenities', 'id, name — reference list (WiFi, Pool, Gym...)'],
        ['hotel_amenities', 'hotel_id (FK) + amenity_id (FK) — junction table M:N'],
        ['activities', 'id, name, icon — reference list (Ski, Spa, Tennis...)'],
        ['hotel_activities', 'hotel_id (FK) + activity_id (FK) — junction table M:N'],
        ['files', 'id, hotel_id (FK), uploaded_by (FK), storage_path, mime_type, size'],
      ], [2200, 7160]),
      spacer(),

      h2('4.2 Relationships'),
      h3('One-to-Many (1:N)'),
      p('One record in table A can relate to MANY records in table B. The "many" side holds the foreign key.'),
      spacer(),
      codeBlock([
        'users (1) ─────── hotels (N)     one owner has many hotels',
        'hotels (1) ─────── rooms (N)     one hotel has many rooms',
        'rooms (1) ─────── bookings (N)   one room has many bookings',
        'users (1) ─────── bookings (N)   one guest has many bookings',
        '',
        '-- The "many" side stores the foreign key:',
        'hotels.created_by  references  users.id',
        'rooms.hotel_id     references  hotels.id',
        'bookings.room_id   references  rooms.id',
      ]),
      spacer(),

      h3('Many-to-Many (M:N)'),
      p('One hotel can have many amenities, and one amenity can belong to many hotels. Solved with a junction (bridge) table:'),
      spacer(),
      codeBlock([
        'hotels ──────── hotel_amenities ──────── amenities',
        '  id              hotel_id (FK)             id',
        '                  amenity_id (FK)           name',
        '',
        '-- Example: Grand Hotel has WiFi, Pool, Gym',
        'INSERT INTO hotel_amenities (hotel_id, amenity_id)',
        'VALUES (1, 3), (1, 7), (1, 12)',
        '',
        '-- Same pattern for activities:',
        'hotels ──────── hotel_activities ──────── activities',
      ]),
      spacer(),

      h2('4.3 Data Integrity'),
      p('The database enforces rules so bad data can never be saved:'),
      bullet('NOT NULL — email, password_hash, role cannot be empty'),
      bullet('UNIQUE — email must be unique across all users'),
      bullet('FOREIGN KEY — booking.room_id must reference a real room that exists'),
      bullet('ON DELETE CASCADE — deleting a hotel automatically deletes its rooms'),
      bullet('ENUM / CHECK — status must be one of: pending, approved, rejected'),
      spacer(),

      h2('4.4 The Availability Query (complex)'),
      p('When searching hotels by dates, the backend must exclude hotels with no available rooms:'),
      spacer(),
      codeBlock([
        '-- Find rooms that are BOOKED in the requested period:',
        'SELECT DISTINCT room_id FROM bookings',
        'WHERE status = "confirmed"',
        '  AND check_in  < requested_check_out',
        '  AND check_out > requested_check_in',
        '',
        '-- Then exclude hotels where ALL rooms are booked',
        '-- (a hotel is available if at least ONE room is free)',
      ]),
      spacer(),
      infoBox('Why < and > (not <= and >=)?', [
        'If guest A checks out on June 5, and guest B checks in on June 5 — that is allowed.',
        'The room is cleaned between checkout and check-in on the same day.',
        'Using < and > (strict) means: June 5 checkout and June 5 check-in do NOT conflict.',
        'Using <= and >= (inclusive) would block same-day turnover.',
      ], LORANGE, ORANGE),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 5 — FRONTEND ARCHITECTURE
      // ══════════════════════════════════════════════════
      h1('5. Frontend Architecture'),

      h2('5.1 File Structure'),
      codeBlock([
        'hono-client/src/',
        '├── pages/           Route-level components (one per page)',
        '│   ├── LandingPage.vue',
        '│   ├── SearchPage.vue',
        '│   ├── HotelDetailPage.vue',
        '│   ├── MyBookingsPage.vue',
        '│   ├── OwnerDashboardPage.vue',
        '│   ├── OwnerHotelDetailPage.vue',
        '│   ├── AdminPage.vue',
        '│   ├── AdminHotelDetailPage.vue',
        '│   ├── LoginPage.vue',
        '│   ├── RegisterPage.vue',
        '│   └── NotFoundPage.vue',
        '├── components/      Reusable UI pieces',
        '│   ├── AppShell.vue       Background + page wrapper',
        '│   ├── AppNavbar.vue      Sticky header with role-aware navigation',
        '│   ├── HotelCard.vue      Search result card',
        '│   ├── StatusBadge.vue    Colored status pill',
        '│   ├── UserAvatar.vue     Initials circle',
        '│   ├── StatCard.vue       Admin stats number card',
        '│   ├── MonthCalendar.vue  Availability calendar grid',
        '│   ├── RoomCard.vue       Room with image, details, book button',
        '│   ├── BookingForm.vue    Sticky reservation sidebar',
        '│   └── BookingListItem.vue  Single booking with cancel button',
        '├── router/index.js  Route definitions + navigation guards',
        '├── stores/auth.js   Pinia store: current user state',
        '└── main.js',
      ]),
      spacer(),

      h2('5.2 Vue 3 Composition API Basics'),
      p('Every Vue component has a <template> (HTML) and a <script setup> (logic). The most important concepts:'),
      spacer(),
      codeBlock([
        '// Reactive data (re-renders when it changes)',
        'const count = ref(0)',
        'const user  = ref(null)',
        '',
        '// Computed value (recalculates when dependencies change)',
        'const fullName = computed(() => user.value.first + " " + user.value.last)',
        '',
        '// Runs on component mount (like "on page load")',
        'onMounted(async () => {',
        '  user.value = await fetchUser()',
        '})',
        '',
        '// Props = data passed FROM parent TO child',
        'const props = defineProps({ booking: { type: Object, required: true } })',
        '',
        '// Emits = events sent FROM child TO parent',
        'const emit = defineEmits(["cancel"])',
        'emit("cancel", booking.id)    // parent listens with @cancel="handleCancel"',
        '',
        '// Expose = make a method callable by parent via ref',
        'defineExpose({ open })',
        '// parent: bookFormRef.value.open(room)',
      ]),
      spacer(),

      h2('5.3 Pinia Auth Store'),
      p('The auth store is the single source of truth for "who is logged in". Every component reads from here instead of making its own API calls.'),
      spacer(),
      codeBlock([
        '// stores/auth.js',
        'export const useAuthStore = defineStore("auth", () => {',
        '  const user    = ref(null)    // null = not logged in',
        '  const loading = ref(false)',
        '',
        '  async function fetchMe() {   // called on every page load',
        '    const res = await fetch("/auth/me", { credentials: "include" })',
        '    user.value = await res.json()  // null if not logged in',
        '  }',
        '',
        '  async function login(email, password) { ... }',
        '  async function logout() { ... }',
        '  return { user, loading, fetchMe, login, logout }',
        '})',
        '',
        '// Using it in any component:',
        'const authStore = useAuthStore()',
        'if (authStore.user?.role === "admin") { /* show admin UI */ }',
      ]),
      spacer(),

      h2('5.4 Vue Router & Navigation Guards'),
      p('Vue Router controls which page component is shown for each URL. Guards run before navigation:'),
      spacer(),
      codeBlock([
        '// router/index.js (simplified)',
        'const routes = [',
        '  { path: "/",          component: LandingPage },',
        '  { path: "/login",     component: LoginPage,     meta: { guestOnly: true } },',
        '  { path: "/my-bookings", component: MyBookingsPage, meta: { requiresAuth: true } },',
        '  { path: "/admin",     component: AdminPage,     meta: { requiresAdmin: true } },',
        '  { path: "/:pathMatch(.*)*", component: NotFoundPage },  // 404 fallback',
        ']',
        '',
        '// Navigation guard — runs before every route change',
        'router.beforeEach(async (to) => {',
        '  await authStore.fetchMe()                // always check who is logged in',
        '  if (to.meta.requiresAuth && !authStore.user)  return "/login"',
        '  if (to.meta.requiresAdmin && authStore.user?.role !== "admin") return "/login"',
        '  if (to.meta.guestOnly    && authStore.user)  return "/search"',
        '})',
      ]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 6 — BACKEND–FRONTEND INTEGRATION
      // ══════════════════════════════════════════════════
      h1('6. Backend–Frontend Integration'),
      p('The frontend (Vue, port 5173) and backend (Hono, port 3000) are separate processes. They communicate via HTTP and cookies.'),
      spacer(),

      h2('6.1 CORS — Why It Exists'),
      p('By default, browsers block JavaScript from making requests to a different domain/port (same-origin policy). CORS (Cross-Origin Resource Sharing) is the mechanism to allow it explicitly:'),
      spacer(),
      codeBlock([
        '// index.ts — backend allows requests from the frontend origin',
        'app.use(\'/*\', cors({',
        '  origin: \'http://localhost:5173\',   // only allow our Vue app',
        '  credentials: true,                 // allow cookies to be sent',
        '}))',
        '',
        '// Without credentials: true, cookies would be blocked by the browser',
      ]),
      spacer(),

      h2('6.2 How Every API Call Works'),
      codeBlock([
        '// Frontend fetch — credentials: "include" is required for cookies',
        'const res = await fetch("http://localhost:3000/bookings/my", {',
        '  credentials: "include",   // <-- sends the session cookie automatically',
        '})',
        'const bookings = await res.json()',
        '',
        '// If status >= 400, handle the error:',
        'if (!res.ok) {',
        '  const error = await res.json()',
        '  console.error(error.message)  // e.g. "Unauthorized"',
        '}',
      ]),
      spacer(),

      h2('6.3 The Full Login Sequence'),
      codeBlock([
        '[BROWSER]                              [SERVER]',
        '',
        'POST /auth/login                -->',
        '{ email, password }                    Validate with Zod',
        '                                       bcrypt.compare(password, hash)',
        '                                       Create session token (UUID)',
        '                                       INSERT INTO sessions...',
        '                         <--    Set-Cookie: session=abc123; HttpOnly',
        '                                { id, name, email, role }',
        '',
        '(cookie stored by browser)',
        '',
        'GET /bookings/my          -->',
        'Cookie: session=abc123              middleware reads cookie',
        '                                    SELECT token FROM sessions...',
        '                                    SELECT * FROM users...',
        '                         <--    [ { hotel: "...", dates: "..." } ]',
      ]),
      spacer(),

      h2('6.4 Component Data Flow Example (Booking)'),
      codeBlock([
        '1. HotelDetailPage.vue loads → fetches /hotels/:id, /hotels/:id/rooms',
        '2. Rooms rendered as <RoomCard> components (receives room as prop)',
        '3. User clicks "Book this room" → RoomCard emits @book event',
        '4. HotelDetailPage.handleBook(room) runs:',
        '   - switches activeTab to "rooms"',
        '   - calls bookFormRef.value.open(room)  (defineExpose!)',
        '5. BookingForm.open(room):',
        '   - checks if user is logged in (redirects to /login if not)',
        '   - pre-fills form.roomId = room.id',
        '6. User fills dates, clicks "Confirm"',
        '7. BookingForm.submit():',
        '   - validates form fields locally',
        '   - POST /bookings with { roomId, checkIn, checkOut, guests }',
        '   - on success: router.push("/my-bookings")',
      ]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 7 — REALTIME (SSE)
      // ══════════════════════════════════════════════════
      h1('7. Realtime with Server-Sent Events (SSE)'),
      p('When a hotel owner submits a new listing, the admin dashboard shows a live notification — without the admin having to refresh the page.'),
      spacer(),

      h2('7.1 What is SSE?'),
      p('SSE (Server-Sent Events) is a one-way connection: server pushes messages to the browser. Unlike WebSockets (two-way), SSE is simpler and perfect for notifications and live feeds.'),
      spacer(),
      infoBox('SSE vs WebSocket', [
        'SSE: server -> browser only. Simple, built into browsers, auto-reconnects.',
        'WebSocket: two-way (browser <-> server). Used for chat, games, collaborative editing.',
        'In this project: admin only needs to RECEIVE notifications, so SSE is the right choice.',
      ]),
      spacer(),

      h2('7.2 Server Side (index.ts)'),
      codeBlock([
        '// Store all active admin connections',
        'const adminClients = new Set()',
        '',
        '// SSE endpoint — admin connects here',
        'app.get("/admin/events", requireAdmin, async (c) => {',
        '  return streamSSE(c, async (stream) => {',
        '    adminClients.add(stream)',
        '',
        '    // Keep alive — ping every 25s to prevent proxy timeout',
        '    const ping = setInterval(() => stream.writeSSE({ event: "ping", data: "" }), 25000)',
        '',
        '    // Clean up when admin disconnects',
        '    stream.onAbort(() => {',
        '      adminClients.delete(stream)',
        '      clearInterval(ping)',
        '    })',
        '  })',
        '})',
        '',
        '// When owner submits hotel → notify all connected admins',
        'function notifyAdmins(hotelName, ownerName) {',
        '  adminClients.forEach(stream => stream.writeSSE({',
        '    event: "new_listing",',
        '    data: JSON.stringify({ hotelName, ownerName })',
        '  }))',
        '}',
      ]),
      spacer(),

      h2('7.3 Frontend Side (AdminPage.vue)'),
      codeBlock([
        '// Connect to SSE stream when admin page loads',
        'onMounted(() => {',
        '  eventSource = new EventSource("http://localhost:3000/admin/events", {',
        '    withCredentials: true   // send session cookie',
        '  })',
        '',
        '  eventSource.addEventListener("new_listing", (e) => {',
        '    const data = JSON.parse(e.data)',
        '    showToast(`New listing: "${data.hotelName}" by ${data.ownerName}`)',
        '    fetchAll()   // refresh pending list + count',
        '  })',
        '})',
        '',
        '// IMPORTANT: close connection when leaving the page',
        'onUnmounted(() => {',
        '  eventSource.close()   // without this: connection stays open forever',
        '})',
      ]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 8 — FILE UPLOAD
      // ══════════════════════════════════════════════════
      h1('8. File Upload'),

      h2('8.1 Upload Flow'),
      numbered('Owner selects an image file in OwnerHotelDetailPage.vue'),
      numbered('Frontend sends FormData (not JSON) via POST /owner/hotels/:id/images'),
      numbered('Backend validates: mime type must be image/*, size must be <= 5MB'),
      numbered('Generate a unique filename: uuid() + ".jpg" (prevents collisions + path traversal)'),
      numbered('Save file to disk: ./uploads/<uuid>.jpg'),
      numbered('Save metadata to database: INSERT INTO files (hotel_id, storage_path, mime_type, size, uploaded_by)'),
      numbered('Return the file URL: /uploads/<uuid>.jpg'),
      spacer(),

      h2('8.2 Backend Validation'),
      codeBlock([
        '// index.ts — image upload endpoint',
        'app.post("/owner/hotels/:id/images", requireOwner, async (c) => {',
        '  const body = await c.req.parseBody()',
        '  const file = body.image   // the uploaded file',
        '',
        '  // Validate mime type',
        '  if (!file.type.startsWith("image/")) {',
        '    return c.json({ error: "Only image files allowed" }, 400)',
        '  }',
        '',
        '  // Validate size (5MB max)',
        '  if (file.size > 5 * 1024 * 1024) {',
        '    return c.json({ error: "File too large (max 5MB)" }, 400)',
        '  }',
        '',
        '  const filename = uuid() + path.extname(file.name)',
        '  const storagePath = path.join("uploads", filename)',
        '  await fs.writeFile(storagePath, Buffer.from(await file.arrayBuffer()))',
        '',
        '  await fileQueries.create({ hotelId, storagePath, ... })',
        '  return c.json({ url: `/uploads/${filename}` })',
        '})',
      ]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 9 — SECURITY
      // ══════════════════════════════════════════════════
      h1('9. Security'),

      h2('9.1 SQL Injection Prevention'),
      p('SQL injection is when an attacker puts SQL code in a form field to manipulate the database. The fix: never concatenate user input into SQL strings. Always use parameterized queries with ? placeholders:'),
      spacer(),
      codeBlock([
        '// DANGEROUS — DO NOT DO THIS:',
        'db.query(`SELECT * FROM users WHERE email = \'${email}\'`)',
        '// If email = "a@b.com\' OR 1=1 --", this returns ALL users',
        '',
        '// CORRECT — parameterized query:',
        'db.query("SELECT * FROM users WHERE email = ?", [email])',
        '// The database treats email as DATA, never as SQL code',
        '// All queries in db.ts use this pattern',
      ]),
      spacer(),

      h2('9.2 Password Security'),
      codeBlock([
        '// Registration — hash before storing:',
        'const hash = await bcrypt.hash(password, 10)',
        'INSERT INTO users (password_hash) VALUES (?), [hash]',
        '',
        '// Login — compare without reversing:',
        'const match = await bcrypt.compare(enteredPassword, storedHash)',
        '// bcrypt internally re-hashes with the same salt and compares',
        '',
        '// What is never returned to frontend:',
        '// GET /auth/me returns: { id, name, email, role }',
        '// NEVER returns: { password_hash, session_token }',
      ]),
      spacer(),

      h2('9.3 Data Access Control'),
      p('The backend always verifies that the logged-in user owns the resource before modifying it:'),
      codeBlock([
        '// Booking cancellation — user can only cancel THEIR OWN bookings',
        'app.put("/bookings/:id/cancel", requireAuth, async (c) => {',
        '  const user = c.get("user")',
        '  const booking = await bookingQueries.findById(id)',
        '',
        '  if (booking.user_id !== user.id) {',
        '    return c.json({ error: "Forbidden" }, 403)',
        '  }',
        '  // Now safe to cancel',
        '})',
        '',
        '// Hotel update — owner can only edit THEIR OWN hotels',
        '// ownerQueries.updateHotel checks: WHERE id = ? AND created_by = ?',
      ]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 10 — ASSIGNMENT CHECKLIST
      // ══════════════════════════════════════════════════
      h1('10. Assignment Requirements Checklist'),
      p('All 34 out of 35 tasks that are completed in this project:'),
      spacer(),

      twoColTable(['Requirement', 'How it was implemented'], [
        ['Register / login / logout', 'auth.ts: POST /auth/register, /auth/login, /auth/logout'],
        ['Delete user + cascade data', 'DELETE /auth/me: soft delete + clear sessions + soft delete hotels'],
        ['Secure passwords', 'bcryptjs.hash(password, 10) on register, .compare() on login'],
        ['Session via cookies', 'httpOnly cookie with UUID token, 7-day expiry, stored in sessions table'],
        ['Protected backend routes (401/403)', 'requireAuth, requireOwner, requireAdmin in middleware.ts'],
        ['Data restricted by user', 'All queries filter by user_id; ownership checked before update/delete'],
        ['Role storage (user/owner/admin)', 'role column in users table, 3 values'],
        ['Role-based middleware', 'requireOwner and requireAdmin chain after requireAuth'],
        ['Admin frontend routes', 'router/index.js: meta: { requiresAdmin: true } with guard'],
        ['Admin dashboard', 'AdminPage.vue: manage hotels, users, bookings, pending approvals'],
        ['Conditional UI by role', 'AppNavbar.vue: links shown/hidden based on authStore.user.role'],
        ['Schema/migrations', 'hono-backend/database/schema.sql + seed.sql'],
        ['One-to-many relationship', 'users->hotels, hotels->rooms, rooms->bookings'],
        ['Many-to-many relationship', 'hotels<->amenities, hotels<->activities (junction tables)'],
        ['DB data integrity', 'NOT NULL, UNIQUE on email, FOREIGN KEYs, ON DELETE CASCADE'],
        ['Full CRUD for one resource', 'Hotels: GET/POST/PUT/DELETE in both owner and admin routes'],
        ['CRUD is authorized', 'Ownership verified in queries: WHERE id = ? AND created_by = ?'],
        ['Protected frontend routes', 'router/index.js guards redirect unauthenticated users to /login'],
        ['Route guards by role', 'Admin/owner routes checked on frontend AND backend'],
        ['404 fallback route', 'NotFoundPage.vue with /:pathMatch(.*)*'],
        ['Global auth store', 'Pinia useAuthStore with fetchMe() called on every navigation'],
        ['Responsive layout', 'Tailwind CSS responsive classes throughout (grid-cols-1 md:grid-cols-3)'],
        ['Reusable components (3+)', '10 components: HotelCard, StatusBadge, UserAvatar, BookingForm, RoomCard, etc.'],
        ['Loading + empty states', 'Every data-fetching page has v-if="loading" and v-else empty state'],
        ['Realtime SSE', '/admin/events stream, EventSource in AdminPage, live toast notifications'],
        ['SSE connection cleanup', 'onUnmounted(() => eventSource.close()) in AdminPage.vue'],
        ['File upload with validation', 'POST /owner/hotels/:id/images, checks mime type + 5MB limit, saves to DB'],
        ['File upload authorized', 'requireOwner middleware + ownership check on hotel'],
        ['Backend validation', 'Zod schemas on auth routes; type/size validation on file uploads'],
        ['Correct HTTP status codes', '200/201/400/401/403/404/500 used correctly throughout'],
        ['No sensitive data exposed', 'User queries never SELECT password_hash; session tokens not returned'],
        ['SQL injection protection', 'All queries use parameterized ? placeholders, never string concat'],
        ['CORS configured', 'Only http://localhost:5173 allowed, credentials: true'],
        ['Modular code structure', 'Backend: 4 files by layer. Frontend: pages/components/stores separated'],
      ], [3200, 6160]),

      pageBreak(),

      // ══════════════════════════════════════════════════
      // SECTION 11 — QUICK REFERENCE GLOSSARY
      // ══════════════════════════════════════════════════
      h1('11. Quick Reference Glossary'),
      p('Terms you need to know for the presentation:'),
      spacer(),

      twoColTable(['Term', 'Plain English explanation'], [
        ['HTTP request/response', 'Browser sends a request (GET, POST, PUT, DELETE). Server sends back a response with a status code and data.'],
        ['REST API', 'A style of API where URLs represent resources (/hotels, /bookings) and HTTP methods represent actions (GET=read, POST=create, PUT=update, DELETE=remove).'],
        ['JSON', 'Data format used between frontend and backend. Like a JavaScript object but as text.'],
        ['Middleware', 'A function that runs before the route handler. Used for auth checks, logging, CORS.'],
        ['Cookie', 'A small piece of data the server sends to the browser, stored locally. Sent back automatically on every request to the same domain.'],
        ['httpOnly cookie', 'A cookie JavaScript cannot read. Only the server can access it. Protects against XSS.'],
        ['Session', 'A way to "remember" a logged-in user. A token is stored in a cookie (browser) and in the DB (server). Each request is verified against the DB.'],
        ['bcrypt', 'A hashing algorithm for passwords. One-way: you can check if a password matches a hash, but you cannot get the original password from the hash.'],
        ['Salt', 'Random data added to a password before hashing. Prevents two identical passwords from having the same hash.'],
        ['JWT', 'An alternative to session cookies. The token itself contains user data and is signed. Not used in this project (sessions used instead).'],
        ['Zod', 'A TypeScript library for validating data shapes. Define a schema, call .parse(data), get type-safe validated data or a clear error.'],
        ['CORS', 'Browser security that blocks cross-origin requests. Backend must explicitly allow the frontend origin.'],
        ['SQL injection', 'Attack where malicious SQL is inserted into user input. Prevented with parameterized queries.'],
        ['XSS', 'Attack where malicious scripts are injected into a page. httpOnly cookies are one defense.'],
        ['Foreign key', 'A column that references the primary key of another table. Enforces referential integrity.'],
        ['Transaction', 'A group of database operations that either all succeed or all fail together. Atomic.'],
        ['Soft delete', 'Setting deleted_at = NOW() instead of DELETE. Data is hidden but preserved.'],
        ['SSE', 'Server-Sent Events. One-way HTTP stream: server pushes events to browser. Simpler than WebSocket.'],
        ['Pinia', "Vue 3's official state management library. A store holds shared state accessible by any component."],
        ['SPA', 'Single Page Application. The browser loads one HTML file; Vue Router swaps components without full page reloads.'],
        ['defineExpose', 'Vue 3 Composition API: explicitly make methods/data available to parent via template ref.'],
        ['Props', 'Data passed from parent component to child component. Read-only in the child.'],
        ['Emit', 'Event sent from child component to parent. Parent listens with @eventName="handler".'],
      ], [2400, 6960]),

    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('Hotelex-Study-Guide.docx', buffer);
  console.log('Created: Hotelex-Study-Guide.docx');
});
