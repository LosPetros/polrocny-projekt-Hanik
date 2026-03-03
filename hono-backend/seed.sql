-- ============================================================
-- HOTELEX - Seed Data
-- Run AFTER schema.sql
-- Admin login: admin@hotelex.sk / admin123
-- ============================================================

-- --------------------------------------------------------
-- Admin user (id=1)
-- --------------------------------------------------------
INSERT INTO users (email, password_hash, role, created_at) VALUES
  ('admin@hotelex.sk', '$2a$10$MgFWKh56Buc3D1/AoQrjE.PCS2/ywzPXg3FYRkHhpAnWN9IgHFaDK', 'admin', NOW());

INSERT INTO user_profiles (user_id, display_name, created_at) VALUES
  (1, 'Admin', NOW());

-- --------------------------------------------------------
-- Room Types
-- --------------------------------------------------------
INSERT INTO room_types (name, description) VALUES
  ('Single',  'Comfortable room for one guest with a single bed'),
  ('Double',  'Spacious room with a double or queen-size bed'),
  ('Suite',   'Luxury suite with a separate living area'),
  ('Family',  'Large room with multiple beds, perfect for families'),
  ('Deluxe',  'Premium room with upgraded furnishings and views');

-- --------------------------------------------------------
-- Amenities
-- --------------------------------------------------------
INSERT INTO amenities (name) VALUES
  ('Free WiFi'),
  ('Swimming Pool'),
  ('Free Parking'),
  ('Spa & Wellness'),
  ('Restaurant'),
  ('Bar'),
  ('Air Conditioning'),
  ('Room Service'),
  ('Fitness Center'),
  ('Pet Friendly'),
  ('Airport Shuttle'),
  ('Breakfast Included'),
  ('Conference Room'),
  ('Balcony'),
  ('Mountain View');

-- --------------------------------------------------------
-- Hotels  (created_by = 1, your admin user)
-- --------------------------------------------------------
INSERT INTO hotels (name, city, address, description, created_by, created_at) VALUES
(
  'Grand Palace Hotel',
  'Bratislava',
  'Hviezdoslavovo námestie 12, 811 02 Bratislava',
  'A five-star luxury hotel in the heart of Bratislava''s Old Town. Steps from the Slovak National Theatre and the Danube riverfront, Grand Palace offers world-class dining, a rooftop spa, and breathtaking views over the city skyline.',
  1, NOW()
),
(
  'Tatra Peak Resort',
  'Poprad',
  'Tatranská Lomnica 15, 059 60 Tatranská Lomnica',
  'A premium mountain resort nestled at the foot of the High Tatras. Tatra Peak offers direct access to ski slopes in winter and scenic hiking trails in summer. Features an indoor pool, alpine spa, and cozy fireside lounge.',
  1, NOW()
),
(
  'Therma Spa & Hotel',
  'Piešťany',
  'Winterova 41, 921 29 Piešťany',
  'World-renowned thermal spa hotel on Spa Island in the heart of Piešťany. Guests enjoy access to natural sulfuric thermal pools, professional balneotherapy treatments, and elegant Belle Époque architecture.',
  1, NOW()
),
(
  'Boutique Hotel Košice',
  'Košice',
  'Hlavná 68, 040 01 Košice',
  'A stylish boutique hotel on Košice''s famous main street, Europe''s longest pedestrian zone. Housed in a restored Art Nouveau building, it blends historic charm with modern comforts, just steps from the Gothic St. Elisabeth Cathedral.',
  1, NOW()
),
(
  'Jasná Mountain Lodge',
  'Liptovský Mikuláš',
  'Demänovská Dolina 72, 031 01 Liptovský Mikuláš',
  'A cozy alpine lodge in Demänovská Valley, Slovakia''s premier ski destination. Perfect for winter sports enthusiasts and summer adventurers alike. Features a wood-burning fireplace, sauna, and locally sourced mountain cuisine.',
  1, NOW()
),
(
  'Hotel Banská Hviezda',
  'Banská Bystrica',
  'Námestie SNP 5, 974 01 Banská Bystrica',
  'A charming mid-century hotel on the historic SNP Square in the geographical heart of Slovakia. Ideal base for exploring central Slovakia''s forests, castles, and the nearby Donovaly ski resort.',
  1, NOW()
);

-- --------------------------------------------------------
-- Rooms
-- (hotel_id order: 1=Grand Palace, 2=Tatra Peak, 3=Therma Spa,
--  4=Boutique Košice, 5=Jasná Lodge, 6=Banská Hviezda)
-- --------------------------------------------------------

-- Grand Palace Hotel (Bratislava) - upscale city hotel
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(1, 2, 'Classic Double',     2, 1, 149.00, 'Elegant room with queen bed, city views, marble bathroom and minibar.', NOW()),
(1, 3, 'Junior Suite',       2, 1, 280.00, 'Spacious suite with separate lounge, king bed, and panoramic Old Town views.', NOW()),
(1, 5, 'Deluxe River View',  2, 1, 210.00, 'Premium room on upper floor with stunning Danube river views and walk-in shower.', NOW()),
(1, 4, 'Family Apartment',   4, 2, 320.00, 'Two-bedroom apartment with full kitchen, ideal for families visiting Bratislava.', NOW());

-- Tatra Peak Resort (Poprad) - mountain resort
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(2, 2, 'Alpine Double',      2, 1, 120.00, 'Warm alpine room with wooden furnishings, mountain view balcony and heated floors.', NOW()),
(2, 1, 'Cozy Single',        1, 1,  80.00, 'Compact room perfect for solo travelers, with ski storage and mountain views.', NOW()),
(2, 4, 'Family Chalet Room', 5, 3, 220.00, 'Large family room with triple beds, kitchenette, and direct access to the garden.', NOW()),
(2, 3, 'Tatra Suite',        2, 1, 350.00, 'Luxury suite with floor-to-ceiling windows facing the High Tatras peaks.', NOW());

-- Therma Spa & Hotel (Piešťany) - wellness hotel
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(3, 2, 'Wellness Double',    2, 1, 160.00, 'Serene room with spa bath, direct access to thermal pool corridor and garden views.', NOW()),
(3, 5, 'Deluxe Spa Room',    2, 1, 230.00, 'Premium room with private jacuzzi, curated wellness amenities and Váh river views.', NOW()),
(3, 3, 'Thermal Suite',      2, 1, 390.00, 'Exclusive suite with private thermal bath, living room and personal spa concierge.', NOW()),
(3, 1, 'Single Treatment',   1, 1,  95.00, 'Quiet single room designed for solo spa retreats, includes daily treatment voucher.', NOW());

-- Boutique Hotel Košice - urban boutique
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(4, 1, 'Urban Single',       1, 1,  75.00, 'Compact stylish room with exposed brick, city center views and designer fixtures.', NOW()),
(4, 2, 'Art Nouveau Double', 2, 1, 115.00, 'Beautifully restored room with original ceiling moldings and a plush king bed.', NOW()),
(4, 5, 'Cathedral View',     2, 1, 155.00, 'Premium room with direct views of the St. Elisabeth Cathedral and cathedral square.', NOW()),
(4, 4, 'Family Suite',       4, 2, 200.00, 'Connected rooms accommodating families with a shared lounge and kitchenette.', NOW());

-- Jasná Mountain Lodge (Liptovský Mikuláš) - ski lodge
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(5, 2, 'Lodge Double',       2, 1,  99.00, 'Rustic double room with pine furnishings, fleece throws, and slope views.', NOW()),
(5, 1, 'Skier''s Single',    1, 1,  65.00, 'Practical single room with ski locker, boot dryer, and slope-side location.', NOW()),
(5, 4, 'Family Loft',        6, 3, 185.00, 'Two-level loft with sleeping area for 6, perfect for a ski group or large family.', NOW()),
(5, 3, 'Mountain Suite',     2, 1, 260.00, 'Top-floor suite with sauna, panoramic valley views, and private terrace.', NOW());

-- Hotel Banská Hviezda - city center
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(6, 1, 'Standard Single',    1, 1,  55.00, 'Clean comfortable single room with square views and free parking.', NOW()),
(6, 2, 'Square Double',      2, 1,  90.00, 'Bright double room overlooking the historic SNP Square.', NOW()),
(6, 5, 'Deluxe Bystrica',    2, 1, 130.00, 'Premium room with upgraded bedding, sitting area and panoramic city views.', NOW()),
(6, 4, 'Family Room',        4, 2, 160.00, 'Spacious family room with two queen beds, ideal for families touring central Slovakia.', NOW());

-- --------------------------------------------------------
-- Room Amenities
-- Amenity IDs:
--  1=WiFi, 2=Pool, 3=Parking, 4=Spa, 5=Restaurant,
--  6=Bar,  7=AC,   8=RoomService, 9=Fitness, 10=PetFriendly,
--  11=AirportShuttle, 12=Breakfast, 13=Conference, 14=Balcony, 15=MountainView
-- --------------------------------------------------------

-- Grand Palace Hotel rooms (id 1-4)
INSERT INTO room_amenities VALUES
(1, 1),(1, 7),(1, 8),(1, 5),(1, 6),           -- Classic Double
(2, 1),(2, 7),(2, 8),(2, 5),(2, 6),(2, 9),    -- Junior Suite
(3, 1),(3, 7),(3, 8),(3, 5),(3, 14),          -- Deluxe River View
(4, 1),(4, 7),(4, 8),(4, 5),(4, 12);          -- Family Apartment

-- Tatra Peak Resort rooms (id 5-8)
INSERT INTO room_amenities VALUES
(5, 1),(5, 7),(5, 14),(5, 15),(5, 12),        -- Alpine Double
(6, 1),(6, 7),(6, 15),                         -- Cozy Single
(7, 1),(7, 7),(7, 10),(7, 12),(7, 15),        -- Family Chalet Room
(8, 1),(8, 4),(8, 8),(8, 14),(8, 15),(8, 9);  -- Tatra Suite

-- Therma Spa & Hotel rooms (id 9-12)
INSERT INTO room_amenities VALUES
(9,  1),(9,  2),(9,  4),(9,  7),(9,  12),     -- Wellness Double
(10, 1),(10, 2),(10, 4),(10, 7),(10, 8),(10,14), -- Deluxe Spa Room
(11, 1),(11, 2),(11, 4),(11, 8),(11, 5),(11,6),  -- Thermal Suite
(12, 1),(12, 4),(12, 7),(12, 12);             -- Single Treatment

-- Boutique Hotel Košice rooms (id 13-16)
INSERT INTO room_amenities VALUES
(13, 1),(13, 7),(13, 12),                      -- Urban Single
(14, 1),(14, 7),(14, 8),(14, 12),             -- Art Nouveau Double
(15, 1),(15, 7),(15, 8),(15, 14),             -- Cathedral View
(16, 1),(16, 7),(16, 12),(16, 13);            -- Family Suite

-- Jasná Mountain Lodge rooms (id 17-20)
INSERT INTO room_amenities VALUES
(17, 1),(17, 3),(17, 7),(17, 15),(17, 12),    -- Lodge Double
(18, 1),(18, 3),(18, 7),(18, 15),             -- Skier's Single
(19, 1),(19, 3),(19, 7),(19, 10),(19, 15),    -- Family Loft
(20, 1),(20, 4),(20, 8),(20, 14),(20, 15);    -- Mountain Suite

-- Hotel Banská Hviezda rooms (id 21-24)
INSERT INTO room_amenities VALUES
(21, 1),(21, 3),(21, 7),(21, 12),             -- Standard Single
(22, 1),(22, 3),(22, 7),(22, 12),(22, 5),     -- Square Double
(23, 1),(23, 3),(23, 7),(23, 8),(23, 14),     -- Deluxe Bystrica
(24, 1),(24, 3),(24, 7),(24, 12),(24, 5);     -- Family Room
