/*
  # FestPerfect Database Schema

  1. New Tables
    - `festivals`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `festival_days`
      - `id` (uuid, primary key)
      - `festival_id` (uuid, foreign key)
      - `date` (date)
      - `created_at` (timestamptz)
    
    - `stages`
      - `id` (uuid, primary key)
      - `festival_day_id` (uuid, foreign key)
      - `name` (text)
      - `color` (text, optional)
      - `created_at` (timestamptz)
    
    - `artist_slots`
      - `id` (uuid, primary key)
      - `festival_id` (uuid, foreign key)
      - `festival_day_id` (uuid, foreign key)
      - `stage_id` (uuid, foreign key)
      - `artist_name` (text)
      - `start_time` (text)
      - `end_time` (text)
      - `priority` (text, enum: must/maybe/skip)
      - `created_at` (timestamptz)
    
    - `contact_info`
      - `id` (uuid, primary key)
      - `festival_id` (uuid, foreign key, unique)
      - `name` (text)
      - `phone` (text)
      - `alternate_contact` (text, optional)
      - `created_at` (timestamptz)
    
    - `shared_plans`
      - `id` (uuid, primary key)
      - `share_id` (text, unique)
      - `festival_id` (uuid, foreign key)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to shared plans
    - Add policies for anonymous users to create and manage their own festivals
*/

CREATE TABLE IF NOT EXISTS festivals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS festival_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id uuid NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_day_id uuid NOT NULL REFERENCES festival_days(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS artist_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id uuid NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
  festival_day_id uuid NOT NULL REFERENCES festival_days(id) ON DELETE CASCADE,
  stage_id uuid NOT NULL REFERENCES stages(id) ON DELETE CASCADE,
  artist_name text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  priority text DEFAULT 'maybe' CHECK (priority IN ('must', 'maybe', 'skip')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  festival_id uuid NOT NULL REFERENCES festivals(id) ON DELETE CASCADE UNIQUE,
  name text NOT NULL,
  phone text NOT NULL,
  alternate_contact text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shared_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id text NOT NULL UNIQUE,
  festival_id uuid NOT NULL REFERENCES festivals(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE festival_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create festivals"
  ON festivals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read festivals"
  ON festivals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update festivals"
  ON festivals FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete festivals"
  ON festivals FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create festival days"
  ON festival_days FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read festival days"
  ON festival_days FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update festival days"
  ON festival_days FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete festival days"
  ON festival_days FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create stages"
  ON stages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read stages"
  ON stages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update stages"
  ON stages FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete stages"
  ON stages FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create artist slots"
  ON artist_slots FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read artist slots"
  ON artist_slots FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update artist slots"
  ON artist_slots FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete artist slots"
  ON artist_slots FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create contact info"
  ON contact_info FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read contact info"
  ON contact_info FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update contact info"
  ON contact_info FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete contact info"
  ON contact_info FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anyone can create shared plans"
  ON shared_plans FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read shared plans"
  ON shared_plans FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can delete shared plans"
  ON shared_plans FOR DELETE
  TO anon
  USING (true);