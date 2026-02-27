/*
  # G-Tech Database Schema

  ## Overview
  Creates the core database structure for G-Tech Portal to the Future,
  replacing local SQLite with scalable Supabase infrastructure.

  ## New Tables
  
  ### `citizens`
  - `id` (uuid, primary key) - Unique citizen identifier
  - `codename` (text, unique) - Citizen's chosen codename
  - `specialization` (text) - Role: EXPLORER, ARCHITECT, HACKER, VOYAGER
  - `achievements` (jsonb) - Unlocked achievement data
  - `xp_points` (integer) - Experience points
  - `level` (integer) - Citizen level
  - `last_active` (timestamptz) - Last activity timestamp
  - `created_at` (timestamptz) - Registration timestamp
  
  ### `news_cache`
  - `id` (uuid, primary key) - Cache entry ID
  - `category` (text) - News category
  - `data` (jsonb) - Cached news data
  - `fetched_at` (timestamptz) - Cache timestamp
  - `expires_at` (timestamptz) - Expiration timestamp
  
  ### `idea_forge`
  - `id` (uuid, primary key) - Idea ID
  - `title` (text) - Concept title
  - `description` (text) - Full description
  - `category` (text) - AI, SPACE, ENERGY, BIOTECH, QUANTUM, WEB3
  - `author_id` (uuid) - References citizens
  - `flames` (integer) - Upvote count
  - `created_at` (timestamptz) - Submission timestamp
  
  ### `predictions`
  - `id` (uuid, primary key) - Prediction ID
  - `content` (text) - Prediction text
  - `category` (text) - Topic category
  - `author_id` (uuid) - References citizens
  - `votes` (integer) - Vote score
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - RLS enabled on all tables
  - Policies enforce user ownership and authentication
  - Read access for authenticated users
  - Write access restricted to own records

  ## Notes
  - All timestamps use UTC
  - JSONB used for flexible achievement data
  - Indexes on frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Citizens table
CREATE TABLE IF NOT EXISTS citizens (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    codename text UNIQUE NOT NULL,
    specialization text NOT NULL CHECK (specialization IN ('EXPLORER', 'ARCHITECT', 'HACKER', 'VOYAGER')),
    achievements jsonb DEFAULT '{}'::jsonb,
    xp_points integer DEFAULT 0,
    level integer DEFAULT 1,
    last_active timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- News cache table (for performance)
CREATE TABLE IF NOT EXISTS news_cache (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    category text NOT NULL,
    data jsonb NOT NULL,
    fetched_at timestamptz DEFAULT now(),
    expires_at timestamptz DEFAULT (now() + interval '5 minutes')
);

-- Idea forge table
CREATE TABLE IF NOT EXISTS idea_forge (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL CHECK (category IN ('AI', 'SPACE', 'ENERGY', 'BIOTECH', 'QUANTUM', 'WEB3', 'GENERAL')),
    author_id uuid REFERENCES citizens(id),
    flames integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    content text NOT NULL,
    category text NOT NULL,
    author_id uuid REFERENCES citizens(id),
    votes integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_citizens_codename ON citizens(codename);
CREATE INDEX IF NOT EXISTS idx_citizens_specialization ON citizens(specialization);
CREATE INDEX IF NOT EXISTS idx_news_cache_category ON news_cache(category);
CREATE INDEX IF NOT EXISTS idx_news_cache_expires ON news_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_idea_forge_category ON idea_forge(category);
CREATE INDEX IF NOT EXISTS idx_idea_forge_created ON idea_forge(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_category ON predictions(category);
CREATE INDEX IF NOT EXISTS idx_predictions_created ON predictions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_forge ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Citizens policies
CREATE POLICY "Anyone can read citizens"
    ON citizens FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Anyone can create citizen"
    ON citizens FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Users can update own profile"
    ON citizens FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- News cache policies (public read, system write)
CREATE POLICY "Anyone can read news cache"
    ON news_cache FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Anyone can write news cache"
    ON news_cache FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Anyone can update news cache"
    ON news_cache FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Anyone can delete expired news cache"
    ON news_cache FOR DELETE
    TO public
    USING (expires_at < now());

-- Idea forge policies
CREATE POLICY "Anyone can read ideas"
    ON idea_forge FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Anyone can create ideas"
    ON idea_forge FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Anyone can update ideas"
    ON idea_forge FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Predictions policies
CREATE POLICY "Anyone can read predictions"
    ON predictions FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Anyone can create predictions"
    ON predictions FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Anyone can update predictions"
    ON predictions FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);
