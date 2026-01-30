-- Migration 001: Enable Extensions & Create Enums
-- Run this FIRST in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- Create custom enum types
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'premium');
CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'active', 'suspended');
CREATE TYPE analytics_event_type AS ENUM ('view', 'website_click', 'phone_click', 'inquiry');
CREATE TYPE inquiry_status AS ENUM ('new', 'read', 'replied', 'archived');
