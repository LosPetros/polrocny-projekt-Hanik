-- ============================================================
-- HOTELEX - Full Schema
-- Run this in phpMyAdmin > hotelex database > SQL tab
-- ============================================================

-- Drop in reverse FK order
DROP TABLE IF EXISTS booking_files;
DROP TABLE IF EXISTS hotel_activities;
DROP TABLE IF EXISTS hotel_amenities;
DROP TABLE IF EXISTS room_amenities;
DROP TABLE IF EXISTS room_images;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS hotel_images;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS hotels;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS room_types;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- --------------------------------------------------------
-- users
-- --------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  NOT NULL DEFAULT 'user',
  created_at    DATETIME     NOT NULL,
  deleted_at    DATETIME     NULL
);

-- --------------------------------------------------------
-- user_profiles
-- --------------------------------------------------------
CREATE TABLE user_profiles (
  user_id      INT          PRIMARY KEY,
  display_name VARCHAR(255) NULL,
  phone        VARCHAR(50)  NULL,
  created_at   DATETIME     NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- sessions
-- --------------------------------------------------------
CREATE TABLE sessions (
  token      VARCHAR(36) PRIMARY KEY,
  user_id    INT         NOT NULL,
  expires_at DATETIME    NOT NULL,
  created_at DATETIME    NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- room_types
-- --------------------------------------------------------
CREATE TABLE room_types (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT         NULL
);

-- --------------------------------------------------------
-- amenities
-- --------------------------------------------------------
CREATE TABLE amenities (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- --------------------------------------------------------
-- files
-- --------------------------------------------------------
CREATE TABLE files (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  owner_user_id INT          NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime          VARCHAR(100) NOT NULL,
  size_bytes    INT          NOT NULL,
  storage_path  VARCHAR(500) NOT NULL,
  created_at    DATETIME     NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- hotels
-- --------------------------------------------------------
CREATE TABLE hotels (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  city             VARCHAR(255) NOT NULL,
  address          VARCHAR(500) NULL,
  description      TEXT         NULL,
  nearby           TEXT         NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'pending',
  rejection_reason TEXT         NULL,
  created_by       INT          NOT NULL,
  created_at       DATETIME     NOT NULL,
  deleted_at       DATETIME     NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- --------------------------------------------------------
-- hotel_images
-- --------------------------------------------------------
CREATE TABLE hotel_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id   INT      NOT NULL,
  file_id    INT      NOT NULL,
  sort_order INT      NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id)  REFERENCES files(id)  ON DELETE CASCADE
);

-- --------------------------------------------------------
-- activities  (hiking, skiing, city tours, etc.)
-- --------------------------------------------------------
CREATE TABLE activities (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)  NOT NULL DEFAULT 'star'
);

-- --------------------------------------------------------
-- hotel_activities
-- --------------------------------------------------------
CREATE TABLE hotel_activities (
  hotel_id    INT NOT NULL,
  activity_id INT NOT NULL,
  PRIMARY KEY (hotel_id, activity_id),
  FOREIGN KEY (hotel_id)    REFERENCES hotels(id)     ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- hotel_amenities
-- --------------------------------------------------------
CREATE TABLE hotel_amenities (
  hotel_id   INT NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (hotel_id, amenity_id),
  FOREIGN KEY (hotel_id)   REFERENCES hotels(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- favorites
-- --------------------------------------------------------
CREATE TABLE favorites (
  user_id    INT      NOT NULL,
  hotel_id   INT      NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (user_id, hotel_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- rooms
-- --------------------------------------------------------
CREATE TABLE rooms (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id        INT          NOT NULL,
  room_type_id    INT          NOT NULL,
  name            VARCHAR(255) NOT NULL,
  capacity        INT          NOT NULL,
  beds            INT          NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  description     TEXT         NULL,
  created_at      DATETIME     NOT NULL,
  deleted_at      DATETIME     NULL,
  FOREIGN KEY (hotel_id)     REFERENCES hotels(id)     ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- --------------------------------------------------------
-- room_images
-- --------------------------------------------------------
CREATE TABLE room_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  room_id    INT      NOT NULL,
  file_id    INT      NOT NULL,
  sort_order INT      NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  FOREIGN KEY (room_id)  REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id)  REFERENCES files(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- room_amenities
-- --------------------------------------------------------
CREATE TABLE room_amenities (
  room_id    INT NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (room_id, amenity_id),
  FOREIGN KEY (room_id)    REFERENCES rooms(id)     ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- bookings
-- --------------------------------------------------------
CREATE TABLE bookings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  room_id      INT          NOT NULL,
  check_in     DATE         NOT NULL,
  check_out    DATE         NOT NULL,
  guests       INT          NOT NULL,
  status       VARCHAR(50)  NOT NULL DEFAULT 'pending',
  note         TEXT         NULL,
  created_at   DATETIME     NOT NULL,
  cancelled_at DATETIME     NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- --------------------------------------------------------
-- booking_files
-- --------------------------------------------------------
CREATE TABLE booking_files (
  booking_id INT NOT NULL,
  file_id    INT NOT NULL,
  PRIMARY KEY (booking_id, file_id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (file_id)    REFERENCES files(id)    ON DELETE CASCADE
);
