-- ============================================================
-- HOTELEX — Activities & rich hotel data
-- Run this ONCE in phpMyAdmin > hotelex > SQL tab
-- ============================================================

-- 1. Add nearby field to hotels
ALTER TABLE hotels
  ADD COLUMN IF NOT EXISTS nearby TEXT NULL AFTER description;

-- 2. Activities reference table
CREATE TABLE IF NOT EXISTS activities (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)  NOT NULL DEFAULT 'star'
);

-- 3. Hotel-to-activity pivot
CREATE TABLE IF NOT EXISTS hotel_activities (
  hotel_id    INT NOT NULL,
  activity_id INT NOT NULL,
  PRIMARY KEY (hotel_id, activity_id),
  FOREIGN KEY (hotel_id)    REFERENCES hotels(id)     ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- 4. Seed activity types
INSERT IGNORE INTO activities (id, name, icon) VALUES
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

-- 5. Link hotels → activities
--    1 = Grand Palace (Bratislava)
--    2 = Tatra Peak Resort (Poprad)
--    3 = Therma Spa & Hotel (Piešťany)
--    4 = Boutique Hotel Košice
--    5 = Jasná Mountain Lodge
--    6 = Hotel Banská Hviezda
INSERT IGNORE INTO hotel_activities (hotel_id, activity_id) VALUES
  (1, 5), (1, 11), (1, 12),            -- Grand Palace: cycling · city tours · wine
  (2, 1), (2, 2), (2, 3), (2, 4),      -- Tatra Peak: hiking · ski · snowboard · mtb
  (3, 6), (3, 7), (3, 9), (3, 5),      -- Therma Spa: swimming · spa · golf · cycling
  (4, 5), (4, 11),                      -- Košice: cycling · city tours
  (5, 1), (5, 2), (5, 3), (5, 4),      -- Jasná: hiking · ski · snowboard · mtb
  (6, 1), (6, 5), (6, 11);             -- Banská: hiking · cycling · city tours

-- 6. Update hotel nearby descriptions
UPDATE hotels SET nearby =
  'Walking distance from Hviezdoslavovo námestie, the Slovak National Theatre, and the Danube promenade. Bratislava Old Town is 5 minutes on foot. Bratislava Castle — with panoramic views of the city and river — is a 15-minute walk uphill.'
WHERE id = 1;

UPDATE hotels SET nearby =
  'Direct access to High Tatras National Park trails right from the hotel. Štrbské Pleso glacial lake is 20 minutes by car. The Tatranská Lomnica cable car reaches 2,196 m elevation. Aquacity Poprad indoor water park is 30 minutes away.'
WHERE id = 2;

UPDATE hotels SET nearby =
  'Located on Spa Island in the heart of Piešťany, between two branches of the Váh river. The historic Napoleon Baths spa complex is adjacent. The town centre is a 10-minute walk across the colonnade bridge. The surrounding area is flat and perfect for cycling.'
WHERE id = 3;

UPDATE hotels SET nearby =
  'On Košice''s famous Hlavná ulica, the longest pedestrian zone in Central Europe. St. Elisabeth Cathedral — the easternmost Gothic cathedral in Europe — is 200 m from the front door. The East Slovak Museum and the Singing Fountain are within a 5-minute walk.'
WHERE id = 4;

UPDATE hotels SET nearby =
  'Located at the entrance to Demänovská Valley with direct slope-side access to Jasná — Slovakia''s largest ski area, with 49 km of pistes and 32 lifts. Demänovská Cave of Liberty is 3 km away. Liptovská Mara reservoir is 15 minutes by car for summer sailing and water sports.'
WHERE id = 5;

UPDATE hotels SET nearby =
  'On SNP Square in the geographical centre of Slovakia. The Banská Bystrica Castle Museum complex and city walls are adjacent. Donovaly ski resort is 30 minutes away. Low Tatras National Park trailheads start 20 minutes from the hotel. Harmanecká Cave is a 25-minute drive.'
WHERE id = 6;
