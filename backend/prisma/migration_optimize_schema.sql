-- Migration: Optimize User Schema
-- This migration consolidates duplicate fields and optimizes the database structure

BEGIN;

-- 1. Add new optimized fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS smoking_habits VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS drinking_habits VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_style VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS hosting_style VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekend_style VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS pet_ownership VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS languages_spoken TEXT[];

-- 2. Migrate data from old fields to new fields

-- Migrate smoking/drinking data
UPDATE users SET 
  smoking_habits = CASE 
    WHEN smoker = true THEN 'Regularly'
    ELSE 'Never'
  END
WHERE smoking_habits IS NULL;

UPDATE users SET 
  drinking_habits = alcohol_usage
WHERE drinking_habits IS NULL AND alcohol_usage IS NOT NULL;

-- Migrate personality data
UPDATE users SET 
  social_style = CASE
    WHEN party_person = true THEN 'Party Person'
    WHEN personality_type = 'Homebody' THEN 'Homebody'
    WHEN personality_type IN ('Extrovert', 'Social Butterfly') THEN 'Social'
    ELSE 'Balanced'
  END
WHERE social_style IS NULL;

-- Migrate language data
UPDATE users SET 
  languages_spoken = language_spoken
WHERE languages_spoken IS NULL AND language_spoken IS NOT NULL;

-- Migrate pet data
UPDATE users SET 
  pet_ownership = CASE
    WHEN pet_owner = true THEN 'Own pets'
    ELSE 'No pets'
  END
WHERE pet_ownership IS NULL;

-- 3. Change moveInDate to proper datetime (if it contains valid date strings)
-- Note: This might need manual review based on existing data format
ALTER TABLE users ADD COLUMN IF NOT EXISTS move_in_date_new TIMESTAMP;

-- If moveInDate contains ISO strings, convert them:
-- UPDATE users SET move_in_date_new = move_in_date::timestamp WHERE move_in_date IS NOT NULL;

-- 4. Rename fields for consistency
ALTER TABLE users RENAME COLUMN cleanliness_level TO cleanliness;
ALTER TABLE users RENAME COLUMN personality_type TO personality_type_old;
ALTER TABLE users RENAME COLUMN personality TO personality_type;

-- 5. Drop redundant/duplicate fields (CAUTION: Do this after data migration is verified)
-- Uncomment these after verifying data migration:

-- ALTER TABLE users DROP COLUMN IF EXISTS smoker;
-- ALTER TABLE users DROP COLUMN IF EXISTS alcohol_usage; 
-- ALTER TABLE users DROP COLUMN IF EXISTS party_person;
-- ALTER TABLE users DROP COLUMN IF EXISTS pet_owner;
-- ALTER TABLE users DROP COLUMN IF EXISTS language_spoken;
-- ALTER TABLE users DROP COLUMN IF EXISTS location; -- Keep locality
-- ALTER TABLE users DROP COLUMN IF EXISTS about; -- Keep bio
-- ALTER TABLE users DROP COLUMN IF EXISTS eating_preference; -- Keep dietaryPrefs
-- ALTER TABLE users DROP COLUMN IF EXISTS cleanliness; -- If it's the string version
-- ALTER TABLE users DROP COLUMN IF EXISTS personality_type_old;
-- ALTER TABLE users DROP COLUMN IF EXISTS saturday_vibe;
-- ALTER TABLE users DROP COLUMN IF EXISTS guest_host;

COMMIT;
