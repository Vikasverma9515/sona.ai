-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  whatsapp_id text unique not null,
  autonomy_mode text default 'assist',
  google_tokens jsonb, -- Stores access_token, refresh_token, expiry
  created_at timestamptz default now()
);

-- Groups table
create table if not exists groups (
  id uuid primary key default uuid_generate_v4(),
  whatsapp_group_id text unique not null,
  summaries_enabled boolean default true,
  created_at timestamptz default now()
);

-- Tasks table
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  group_id uuid references groups(id),
  task_text text not null,
  due_at timestamptz,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Agent Logs table
create table if not exists agent_logs (
  id uuid primary key default uuid_generate_v4(),
  event_type text,
  payload jsonb,
  created_at timestamptz default now()
);

-- Memories table
create table if not exists memories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  content text not null,
  context text, -- e.g., "preference", "fact", "relationship"
  created_at timestamptz default now()
);
