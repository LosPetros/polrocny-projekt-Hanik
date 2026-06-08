-- ============================================================
-- HOTELEX — Seed Data  (run AFTER schema.sql)
-- Admin login: admin@hotelex.sk / admin123
-- ============================================================

-- ── Users ────────────────────────────────────────────────
INSERT INTO users (email, password_hash, role, created_at) VALUES
  ('admin@hotelex.sk', '$2a$10$MgFWKh56Buc3D1/AoQrjE.PCS2/ywzPXg3FYRkHhpAnWN9IgHFaDK', 'admin', NOW());

INSERT INTO user_profiles (user_id, display_name, created_at) VALUES
  (1, 'Admin', NOW());

-- ── Room types ───────────────────────────────────────────
INSERT INTO room_types (name, description) VALUES
  ('Single',  'Comfortable room for one guest with a single bed'),
  ('Double',  'Spacious room with a double or queen-size bed'),
  ('Suite',   'Luxury suite with a separate living area'),
  ('Family',  'Large room with multiple beds, perfect for families'),
  ('Deluxe',  'Premium room with upgraded furnishings and views');

-- ── Amenities ────────────────────────────────────────────
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

-- ── Activities ───────────────────────────────────────────
INSERT INTO activities (id, name, icon) VALUES
  (1,  'Hiking',         'mountain'),
  (2,  'Skiing',         'ski'),
  (3,  'Snowboarding',   'snowboard'),
  (4,  'Mountain Biking','bike'),
  (5,  'Cycling',        'bicycle'),
  (6,  'Swimming',       'waves'),
  (7,  'Spa & Wellness', 'spa'),
  (8,  'Tennis',         'tennis'),
  (9,  'Golf',           'golf'),
  (10, 'Kayaking',       'kayak'),
  (11, 'City Tours',     'map'),
  (12, 'Wine Tasting',   'wine');

-- ── Hotels  (all approved, created_by = admin) ───────────
INSERT INTO hotels (name, city, address, description, nearby, status, created_by, created_at) VALUES
(
  'Grand Palace Hotel', 'Bratislava',
  'Hviezdoslavovo námestie 12, 811 02 Bratislava',
  'A five-star luxury hotel in the heart of Bratislava''s Old Town. Steps from the Slovak National Theatre and the Danube riverfront, Grand Palace offers world-class dining, a rooftop spa, and breathtaking views over the city skyline.',
  'Walking distance from Hviezdoslavovo námestie, the Slovak National Theatre, and the Danube promenade. Bratislava Old Town is 5 minutes on foot. Bratislava Castle, with panoramic views of the city and river, is a 15-minute walk uphill. The Blue Church, a rare Art Nouveau gem, is 10 minutes away.',
  'approved', 1, NOW()
),
(
  'Tatra Peak Resort', 'Poprad',
  'Tatranská Lomnica 15, 059 60 Tatranská Lomnica',
  'A premium mountain resort nestled at the foot of the High Tatras. Tatra Peak offers direct access to ski slopes in winter and scenic hiking trails in summer. Features an indoor pool, alpine spa, and cosy fireside lounge.',
  'Direct access to High Tatras National Park trails from the hotel grounds. Štrbské Pleso glacial lake is 20 minutes by car. The Tatranská Lomnica cable car reaches 2,196 m elevation with panoramic Tatra views. Aquacity Poprad indoor water park is 30 minutes away.',
  'approved', 1, NOW()
),
(
  'Therma Spa & Hotel', 'Piešťany',
  'Winterova 41, 921 29 Piešťany',
  'World-renowned thermal spa hotel on Spa Island in the heart of Piešťany. Guests enjoy natural sulfuric thermal pools, professional balneotherapy treatments, and elegant Belle Époque architecture.',
  'Located on Spa Island between two branches of the Váh river. The historic Napoleon Baths spa complex is adjacent. The town centre is a 10-minute walk across the colonnade bridge. Flat terrain throughout the island makes it perfect for cycling.',
  'approved', 1, NOW()
),
(
  'Boutique Hotel Košice', 'Košice',
  'Hlavná 68, 040 01 Košice',
  'A stylish boutique hotel on Košice''s famous main street, Europe''s longest pedestrian zone. Housed in a restored Art Nouveau building, it blends historic charm with modern comforts.',
  'St. Elisabeth Cathedral — the easternmost Gothic cathedral in Europe — is 200 m from the front door. The East Slovak Museum, Singing Fountain, and Miklušova Väznica underground prison museum are all within a 5-minute walk. The city has an excellent network of cycling paths.',
  'approved', 1, NOW()
),
(
  'Jasná Mountain Lodge', 'Liptovský Mikuláš',
  'Demänovská Dolina 72, 031 01 Liptovský Mikuláš',
  'A cosy alpine lodge in Demänovská Valley, Slovakia''s premier ski destination. Features a wood-burning fireplace, sauna, and locally sourced mountain cuisine. Perfect for both winter and summer adventures.',
  'Direct slope-side access to Jasná — Slovakia''s largest ski area with 49 km of pistes and 32 lifts. Demänovská Cave of Liberty is 3 km away. Liptovská Mara reservoir is 15 minutes by car for summer sailing and water sports. The valley is also a top trail-running destination.',
  'approved', 1, NOW()
),
(
  'Hotel Banská Hviezda', 'Banská Bystrica',
  'Námestie SNP 5, 974 01 Banská Bystrica',
  'A charming mid-century hotel on the historic SNP Square in the geographical heart of Slovakia. Ideal base for exploring central Slovakia''s forests, castles, and the nearby Donovaly ski resort.',
  'Banská Bystrica Castle Museum and city walls are adjacent. Donovaly ski resort is 30 minutes away. Low Tatras National Park trailheads start 20 minutes from the hotel. Harmanecká Cave is a 25-minute drive. The city''s SNP Museum, commemorating the Slovak National Uprising, is across the square.',
  'approved', 1, NOW()
),
(
  'Aqua Liptov Resort', 'Liptovský Mikuláš',
  'Pri aquaparku 1136, 031 01 Liptovský Mikuláš',
  'A modern lakeside resort on the shores of Liptovská Mara, Slovakia''s largest reservoir. Surrounded by the Low Tatras and Western Tatras, this is the ideal summer escape with direct beach access, a water sports centre, and an outdoor pool overlooking the mountains.',
  'Liptovská Mara reservoir is right outside the hotel — rent kayaks, stand-up paddleboards, or take sailing lessons directly from the resort''s water sports centre. Jasná ski resort is 20 minutes away. Vlkolínec UNESCO village is 40 minutes. The historic spa town of Lúčky is 15 minutes by car.',
  'approved', 1, NOW()
),
(
  'Orava Castle View', 'Dolný Kubín',
  'Hviezdoslavovo námestie 16, 026 01 Dolný Kubín',
  'A boutique mountain hotel with direct views of the legendary Orava Castle — one of Slovakia''s most dramatic medieval fortresses perched on a 112 m rock above the Orava river. The hotel combines rustic warmth with modern comfort in the heart of the Orava region.',
  'Orava Castle is 15 minutes by car — one of Slovakia''s most visited landmarks and a filming location for the 1922 film Nosferatu. The Orava river corridor is perfect for cycling and kayaking. Zuberec open-air museum of folk architecture is 25 minutes away. Western Tatras hiking trails start 30 minutes from the hotel.',
  'approved', 1, NOW()
),
(
  'Small Carpathian Wine Estate', 'Pezinok',
  'Cajlanská 45, 902 01 Pezinok',
  'A stunning vineyard hotel nestled in the rolling hills of the Small Carpathians wine route, just 25 km from Bratislava. The estate grows Welschriesling, Grüner Veltliner, and Pinot Noir on 8 hectares. Guests enjoy cellar tastings, vineyard walks, and exceptional Slovak cuisine paired with estate wines.',
  'Located on the Small Carpathian Wine Route connecting 12 wine towns. Modra, the ceramic and wine capital, is 10 minutes away. Červený Kameň Castle is a 15-minute drive. Bratislava Airport is 20 minutes. The Carpathian forest above the vineyards has excellent marked hiking and cycling trails.',
  'approved', 1, NOW()
);

-- ── Rooms ────────────────────────────────────────────────
-- Grand Palace (id=1)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(1, 2, 'Classic Double',     2, 1, 149.00, 'Elegant room with queen bed, city views, marble bathroom and minibar.', NOW()),
(1, 3, 'Junior Suite',       2, 1, 280.00, 'Spacious suite with separate lounge, king bed, and panoramic Old Town views.', NOW()),
(1, 5, 'Deluxe River View',  2, 1, 210.00, 'Premium room on upper floor with stunning Danube river views and walk-in shower.', NOW()),
(1, 4, 'Family Apartment',   4, 2, 320.00, 'Two-bedroom apartment with full kitchen, ideal for families visiting Bratislava.', NOW());

-- Tatra Peak (id=2)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(2, 2, 'Alpine Double',       2, 1, 120.00, 'Warm alpine room with wooden furnishings, mountain-view balcony, and heated floors.', NOW()),
(2, 1, 'Cosy Single',         1, 1,  80.00, 'Compact room for solo travellers with ski storage and mountain views.', NOW()),
(2, 4, 'Family Chalet Room',  5, 3, 220.00, 'Large family room with triple beds, kitchenette, and direct garden access.', NOW()),
(2, 3, 'Tatra Suite',         2, 1, 350.00, 'Luxury suite with floor-to-ceiling windows facing the High Tatras peaks.', NOW());

-- Therma Spa (id=3)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(3, 2, 'Wellness Double',   2, 1, 160.00, 'Serene room with spa bath, direct access to thermal pool corridor, and garden views.', NOW()),
(3, 5, 'Deluxe Spa Room',   2, 1, 230.00, 'Premium room with private jacuzzi, curated wellness amenities, and Váh river views.', NOW()),
(3, 3, 'Thermal Suite',     2, 1, 390.00, 'Exclusive suite with private thermal bath, living room, and personal spa concierge.', NOW()),
(3, 1, 'Single Treatment',  1, 1,  95.00, 'Quiet single room designed for solo spa retreats with daily treatment voucher.', NOW());

-- Boutique Košice (id=4)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(4, 1, 'Urban Single',        1, 1,  75.00, 'Compact stylish room with exposed brick, city-centre views, and designer fixtures.', NOW()),
(4, 2, 'Art Nouveau Double',  2, 1, 115.00, 'Beautifully restored room with original ceiling mouldings and a plush king bed.', NOW()),
(4, 5, 'Cathedral View',      2, 1, 155.00, 'Premium room with direct views of the St. Elisabeth Cathedral.', NOW()),
(4, 4, 'Family Suite',        4, 2, 200.00, 'Connected rooms for families with shared lounge and kitchenette.', NOW());

-- Jasná Lodge (id=5)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(5, 2, 'Lodge Double',    2, 1,  99.00, 'Rustic double with pine furnishings, fleece throws, and slope views.', NOW()),
(5, 1, 'Skier''s Single', 1, 1,  65.00, 'Practical single with ski locker, boot dryer, and slope-side location.', NOW()),
(5, 4, 'Family Loft',     6, 3, 185.00, 'Two-level loft sleeping 6, perfect for a ski group or large family.', NOW()),
(5, 3, 'Mountain Suite',  2, 1, 260.00, 'Top-floor suite with sauna, panoramic valley views, and private terrace.', NOW());

-- Banská Hviezda (id=6)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(6, 1, 'Standard Single',  1, 1,  55.00, 'Clean comfortable single with square views and free parking.', NOW()),
(6, 2, 'Square Double',    2, 1,  90.00, 'Bright double overlooking the historic SNP Square.', NOW()),
(6, 5, 'Deluxe Bystrica',  2, 1, 130.00, 'Premium room with upgraded bedding, sitting area, and panoramic city views.', NOW()),
(6, 4, 'Family Room',      4, 2, 160.00, 'Spacious family room with two queen beds.', NOW());

-- Aqua Liptov (id=7)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(7, 2, 'Lake View Double',  2, 1, 110.00, 'Bright room with floor-to-ceiling windows and direct views of Liptovská Mara reservoir.', NOW()),
(7, 4, 'Family Lakeside',   5, 2, 195.00, 'Two-bedroom suite with a private terrace, kitchenette, and uninterrupted lake panorama.', NOW()),
(7, 1, 'Standard Single',   1, 1,  70.00, 'Comfortable single room with mountain views and access to all resort facilities.', NOW()),
(7, 3, 'Panorama Suite',    2, 1, 280.00, 'Signature suite with a private balcony jacuzzi overlooking the lake and Western Tatras.', NOW());

-- Orava Castle View (id=8)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(8, 2, 'Castle View Double', 2, 1, 105.00, 'Room with a direct view of Orava Castle illuminated at night. Wooden decor, stone accents.', NOW()),
(8, 1, 'Standard Single',    1, 1,  68.00, 'Cosy single with rustic Orava folk-art details and valley views.', NOW()),
(8, 3, 'Orava Suite',        2, 1, 225.00, 'Spacious suite with fireplace, four-poster bed, and full castle panorama.', NOW()),
(8, 4, 'Family Room',        4, 2, 175.00, 'Large family room with trundle beds and a shared terrace overlooking the river valley.', NOW());

-- Small Carpathian Wine Estate (id=9)
INSERT INTO rooms (hotel_id, room_type_id, name, capacity, beds, price_per_night, description, created_at) VALUES
(9, 2, 'Vineyard Double',  2, 1, 130.00, 'Bright room with direct vineyard views, wine-themed decor, and a complimentary bottle of estate wine.', NOW()),
(9, 1, 'Barrel Room',      1, 1,  85.00, 'Cosy single in the converted cellar wing with stone walls, arched ceiling, and intimate atmosphere.', NOW()),
(9, 3, 'Estate Suite',     2, 1, 260.00, 'Luxurious suite with a private terrace overlooking the estate, king bed, and daily wine tasting for two.', NOW()),
(9, 4, 'Family Vineyard',  4, 2, 220.00, 'Two-room family suite with vineyard-facing terrace and a small play area for children.', NOW());

-- ── Room amenities ───────────────────────────────────────
-- IDs: 1=WiFi 2=Pool 3=Parking 4=Spa 5=Restaurant 6=Bar 7=AC
--      8=RoomService 9=Fitness 10=PetFriendly 11=AirportShuttle
--      12=Breakfast 13=Conference 14=Balcony 15=MountainView

-- Grand Palace (rooms 1-4)
INSERT INTO room_amenities VALUES
(1, 1),(1, 7),(1, 8),(1, 5),(1, 6),
(2, 1),(2, 7),(2, 8),(2, 5),(2, 6),(2, 9),
(3, 1),(3, 7),(3, 8),(3, 5),(3, 14),
(4, 1),(4, 7),(4, 8),(4, 5),(4, 12);

-- Tatra Peak (rooms 5-8)
INSERT INTO room_amenities VALUES
(5, 1),(5, 7),(5, 14),(5, 15),(5, 12),
(6, 1),(6, 7),(6, 15),
(7, 1),(7, 7),(7, 10),(7, 12),(7, 15),
(8, 1),(8, 4),(8, 8),(8, 14),(8, 15),(8, 9);

-- Therma Spa (rooms 9-12)
INSERT INTO room_amenities VALUES
(9,  1),(9,  2),(9,  4),(9,  7),(9,  12),
(10, 1),(10, 2),(10, 4),(10, 7),(10, 8),(10, 14),
(11, 1),(11, 2),(11, 4),(11, 8),(11, 5),(11, 6),
(12, 1),(12, 4),(12, 7),(12, 12);

-- Boutique Košice (rooms 13-16)
INSERT INTO room_amenities VALUES
(13, 1),(13, 7),(13, 12),
(14, 1),(14, 7),(14, 8),(14, 12),
(15, 1),(15, 7),(15, 8),(15, 14),
(16, 1),(16, 7),(16, 12),(16, 13);

-- Jasná Lodge (rooms 17-20)
INSERT INTO room_amenities VALUES
(17, 1),(17, 3),(17, 7),(17, 15),(17, 12),
(18, 1),(18, 3),(18, 7),(18, 15),
(19, 1),(19, 3),(19, 7),(19, 10),(19, 15),
(20, 1),(20, 4),(20, 8),(20, 14),(20, 15);

-- Banská Hviezda (rooms 21-24)
INSERT INTO room_amenities VALUES
(21, 1),(21, 3),(21, 7),(21, 12),
(22, 1),(22, 3),(22, 7),(22, 12),(22, 5),
(23, 1),(23, 3),(23, 7),(23, 8),(23, 14),
(24, 1),(24, 3),(24, 7),(24, 12),(24, 5);

-- Aqua Liptov (rooms 25-28)
INSERT INTO room_amenities VALUES
(25, 1),(25, 2),(25, 7),(25, 14),
(26, 1),(26, 2),(26, 3),(26, 7),(26, 14),(26, 12),
(27, 1),(27, 2),(27, 3),(27, 7),
(28, 1),(28, 2),(28, 4),(28, 8),(28, 14),(28, 9);

-- Orava Castle View (rooms 29-32)
INSERT INTO room_amenities VALUES
(29, 1),(29, 3),(29, 7),(29, 12),(29, 14),
(30, 1),(30, 3),(30, 7),(30, 12),
(31, 1),(31, 3),(31, 7),(31, 8),(31, 14),(31, 15),
(32, 1),(32, 3),(32, 7),(32, 10),(32, 12);

-- Small Carpathian Wine Estate (rooms 33-36)
INSERT INTO room_amenities VALUES
(33, 1),(33, 3),(33, 7),(33, 5),(33, 6),(33, 14),
(34, 1),(34, 3),(34, 7),(34, 5),(34, 6),
(35, 1),(35, 3),(35, 7),(35, 5),(35, 6),(35, 8),(35, 14),(35, 9),
(36, 1),(36, 3),(36, 7),(36, 5),(36, 12),(36, 14);

-- ── Hotel amenities (hotel-level tags) ───────────────────
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES
-- Grand Palace: WiFi Pool Parking Spa Restaurant Bar AC RoomService Fitness Breakfast Conference
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,12),(1,13),
-- Tatra Peak: WiFi Pool Parking Spa Restaurant AC RoomService Fitness Breakfast MountainView
(2,1),(2,2),(2,3),(2,4),(2,5),(2,7),(2,8),(2,9),(2,12),(2,15),
-- Therma Spa: WiFi Pool Parking Spa Restaurant Bar AC RoomService Breakfast
(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,12),
-- Boutique Košice: WiFi Parking Restaurant AC RoomService Breakfast Conference
(4,1),(4,3),(4,5),(4,7),(4,8),(4,12),(4,13),
-- Jasná Lodge: WiFi Pool Parking Spa Restaurant AC Fitness Breakfast PetFriendly MountainView
(5,1),(5,2),(5,3),(5,4),(5,5),(5,7),(5,9),(5,12),(5,10),(5,15),
-- Banská Hviezda: WiFi Parking Restaurant Bar AC Breakfast
(6,1),(6,3),(6,5),(6,6),(6,7),(6,12),
-- Aqua Liptov: WiFi Pool Parking Restaurant Bar AC RoomService Fitness Breakfast PetFriendly
(7,1),(7,2),(7,3),(7,5),(7,6),(7,7),(7,8),(7,9),(7,12),(7,10),
-- Orava Castle View: WiFi Parking Restaurant Bar AC Breakfast PetFriendly MountainView
(8,1),(8,3),(8,5),(8,6),(8,7),(8,12),(8,10),(8,15),
-- Wine Estate: WiFi Parking Restaurant Bar AC Breakfast PetFriendly Balcony
(9,1),(9,3),(9,5),(9,6),(9,7),(9,12),(9,10),(9,14);

-- ── Hotel activities ─────────────────────────────────────
INSERT INTO hotel_activities (hotel_id, activity_id) VALUES
-- Grand Palace: cycling city-tours wine
(1, 5),(1, 11),(1, 12),
-- Tatra Peak: hiking skiing snowboard mtb
(2, 1),(2, 2),(2, 3),(2, 4),
-- Therma Spa: swimming spa golf cycling
(3, 6),(3, 7),(3, 9),(3, 5),
-- Boutique Košice: cycling city-tours
(4, 5),(4, 11),
-- Jasná Lodge: hiking skiing snowboard mtb
(5, 1),(5, 2),(5, 3),(5, 4),
-- Banská Hviezda: hiking cycling city-tours
(6, 1),(6, 5),(6, 11),
-- Aqua Liptov: swimming kayaking cycling hiking
(7, 6),(7, 10),(7, 5),(7, 1),
-- Orava Castle View: hiking cycling kayaking city-tours
(8, 1),(8, 5),(8, 10),(8, 11),
-- Wine Estate: wine-tasting cycling hiking
(9, 12),(9, 5),(9, 1);
