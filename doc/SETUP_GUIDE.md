# Hotelex - Setup & Run Instructions

## Complete Authentication System Implementation

This project now has a fully functional authentication system with:
- User registration & login
- Session-based auth with cookies
- Password hashing with bcryptjs
- SQLite database
- Protected routes (frontend + backend)
- Admin role support
- Premium light design matching the design document

---

## 🚀 Quick Start

### 1. Install Dependencies

**Backend:**
```powershell
cd hono-backend
npm install
```

**Frontend:**
```powershell
cd hono-client
npm install
```

### 2. Run the Application

**Terminal 1 - Backend (Port 3000):**
```powershell
cd hono-backend
npm run dev
```

**Terminal 2 - Frontend (Port 5173):**
```powershell
cd hono-client
npm run dev
```

### 3. Access the Application

Open your browser and go to: **http://localhost:5173**

---

## 📋 How to Use

### Register a New User
1. Click "Sign Up" or navigate to `/register`
2. Fill in:
   - Full Name
   - Email (must contain @ and .)
   - Password (min 6 characters)
   - Confirm Password
3. Click "Create account"
4. You'll be redirected to login

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the search page

### Test Protected Routes
- Visit `/search` - accessible by anyone
- Backend protected route example: http://localhost:3000/protected (must be logged in)
- Backend admin route example: http://localhost:3000/admin (must be admin)

---

## 🗃️ Database

The SQLite database file `hotelex.db` is created automatically in the `hono-backend` folder when you first run the server.

### Tables:
- **users** - stores user accounts
- **sessions** - stores active sessions

### Default User Roles:
- New users get `user` role
- To create an admin, manually update the database:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
  ```

---

## 🔐 API Endpoints

### Auth Routes (http://localhost:3000/auth)

**POST /auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST /auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**POST /auth/logout**
No body required. Clears session cookie.

**GET /auth/me**
Returns current user info or null if not logged in.

### Protected Routes

**GET /protected** - Requires authentication
**GET /admin** - Requires admin role

---

## 🎨 Design Features

- Light sky background with gradient
- Glass-morphism cards (backdrop blur effect)
- Soft borders and subtle shadows
- Premium gradient buttons
- Responsive design
- Smooth transitions
- Form validation with error messages

---

## ✅ School Requirements Checklist

### Backend:
- ✅ Hono.js framework
- ✅ SQLite database
- ✅ Password hashing (bcryptjs)
- ✅ Session management with cookies
- ✅ CORS configured for credentials
- ✅ Auth middleware (requireAuth, requireAdmin)
- ✅ Input validation with Zod
- ✅ Protected routes
- ✅ User roles (user/admin) in database

### Frontend:
- ✅ Vue 3 with Vite
- ✅ Tailwind CSS
- ✅ Vue Router with route guards
- ✅ Pinia state management
- ✅ Login & Register pages
- ✅ Session persistence (auto-restore after reload)
- ✅ Consistent design system
- ✅ Premium light theme matching design doc

---

## 📁 Project Structure

```
hono-backend/
  src/
    index.ts        # Main server entry point
    db.ts           # Database setup & queries
    auth.ts         # Auth routes (register, login, logout, me)
    middleware.ts   # Auth middleware
  hotelex.db        # SQLite database (auto-created)

hono-client/
  src/
    pages/
      LoginPage.vue
      RegisterPage.vue
      SearchPage.vue
    stores/
      auth.js       # Pinia auth store
    router/
      index.js      # Vue Router with guards
    App.vue
    main.js
    style.css       # Tailwind & custom styles
  public/
    sky.jpg         # Background image
```

---

## 🧪 Testing Authentication

1. **Register a user** - should succeed
2. **Try registering with same email** - should fail with error
3. **Login with wrong password** - should fail
4. **Login successfully** - should set cookie and redirect
5. **Reload page while logged in** - session should persist
6. **Logout** - should clear session and redirect
7. **Try accessing /protected without login** - backend returns 401
8. **Access /protected while logged in** - should return user data

---

## 🔒 Security Features

- Passwords hashed with bcryptjs (salt rounds: 10)
- HttpOnly cookies (prevents XSS attacks)
- SameSite=Lax (CSRF protection)
- Session expiry (7 days)
- SQL injection protection (prepared statements)
- CORS restricted to localhost:5173
- Input validation on both frontend and backend

---

## 💡 Next Steps

To continue development:

1. Create hotel management pages
2. Add booking system
3. Implement file upload for hotel images
4. Add admin dashboard
5. Create user profile page with booking history

---

## 🐛 Troubleshooting

**"Module not found" errors:**
- Make sure you ran `npm install` in both folders

**CORS errors:**
- Ensure backend is running on port 3000
- Ensure frontend is running on port 5173
- Check CORS origin in `hono-backend/src/index.ts`

**Can't log in:**
- Check if backend server is running
- Open browser DevTools Network tab to see API responses
- Check backend console for errors

**Database errors:**
- Delete `hotelex.db` file and restart backend to recreate tables

---

## 📝 Notes

- This is a school project, not production-ready
- For production, use HTTPS and set `secure: true` on cookies
- Consider adding rate limiting for auth endpoints
- Add password reset functionality
- Implement refresh tokens for better security
