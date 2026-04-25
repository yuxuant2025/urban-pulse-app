-- ============================================================
-- Urban Pulse – Supabase Schema
-- HOW TO USE:
--   Supabase Dashboard → SQL Editor → New Query → paste all → Run
-- ============================================================


-- ─────────────────────────────────────────
-- ENUMS  (match the TypeScript types in data.ts)
-- ─────────────────────────────────────────
create type mood_type as enum (
  'calm', 'quiet', 'energetic', 'nostalgic', 'misses you',
  'a bit crowded', 'peaceful', 'lively', 'lonely'
);

create type personality_type as enum (
  'The gentle giant', 'The quiet observer', 'The energetic heart',
  'The wise elder', 'The playful spirit'
);

create type capsule_type    as enum ('text', 'photo', 'voice');
create type message_sender  as enum ('place', 'user');


-- ─────────────────────────────────────────
-- PROFILES  (one row per Supabase auth user)
-- ─────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text not null,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-create a profile row whenever someone signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ─────────────────────────────────────────
-- PLACES  (the physical locations)
-- ─────────────────────────────────────────
create table places (
  id           text primary key,
  name         text             not null,
  type         text             not null,
  mood         mood_type        not null,
  personality  personality_type not null,
  color_from   text             not null,
  color_to     text             not null,
  color_shadow text             not null,
  description  text,
  is_discover  boolean          default false,  -- true = Discover tab only
  created_at   timestamptz      default now()
);


-- ─────────────────────────────────────────
-- USER ↔ PLACE RELATIONSHIP
-- (tracks relationship_level, last visited, and personal memories per user)
-- ─────────────────────────────────────────
create table user_places (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references profiles  on delete cascade,
  place_id           text        not null references places    on delete cascade,
  relationship_level int         not null default 0 check (relationship_level between 0 and 100),
  last_visited_at    timestamptz,
  memories           text[]      default '{}',
  unique (user_id, place_id)
);


-- ─────────────────────────────────────────
-- CAPSULES
-- ─────────────────────────────────────────
create table capsules (
  id          uuid         primary key default gen_random_uuid(),
  place_id    text         not null references places   on delete cascade,
  author_id   uuid         not null references profiles on delete cascade,
  type        capsule_type not null,
  content     text,         -- text body or photo caption
  media_url   text,         -- photo URL or voice duration string e.g. "0:24"
  color       text         not null default 'bg-stone-50',
  created_at  timestamptz  default now()
);


-- ─────────────────────────────────────────
-- CHAT MESSAGES
-- (one conversation thread per user per place)
-- ─────────────────────────────────────────
create table chat_messages (
  id            uuid           primary key default gen_random_uuid(),
  place_id      text           not null references places   on delete cascade,
  user_id       uuid           not null references profiles on delete cascade,
  sender        message_sender not null,
  content       text           not null,
  image_url     text,
  action_label  text,          -- optional action button label (e.g. "See the Secret Map")
  created_at    timestamptz    default now()
);


-- ─────────────────────────────────────────
-- FRIENDSHIPS
-- ─────────────────────────────────────────
create table friendships (
  user_id    uuid not null references profiles on delete cascade,
  friend_id  uuid not null references profiles on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);


-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- (controls who can read / write each table)
-- ─────────────────────────────────────────
alter table profiles      enable row level security;
alter table places        enable row level security;
alter table user_places   enable row level security;
alter table capsules      enable row level security;
alter table chat_messages enable row level security;
alter table friendships   enable row level security;

-- profiles: anyone can read, only owner can edit
create policy "Profiles are public"         on profiles for select using (true);
create policy "Users update own profile"    on profiles for update using (auth.uid() = id);

-- places: fully public (read-only for users)
create policy "Places are public"           on places   for select using (true);

-- user_places: private to each user
create policy "Own place relationships"     on user_places for select using (auth.uid() = user_id);
create policy "Insert own place relation"   on user_places for insert with check (auth.uid() = user_id);
create policy "Update own place relation"   on user_places for update using (auth.uid() = user_id);

-- capsules: public read, owner write
create policy "Capsules are public"         on capsules for select using (true);
create policy "Users insert own capsules"   on capsules for insert with check (auth.uid() = author_id);
create policy "Users delete own capsules"   on capsules for delete using (auth.uid() = author_id);

-- chat_messages: private per user
create policy "Own chat history"            on chat_messages for select using (auth.uid() = user_id);
create policy "Insert own messages"         on chat_messages for insert with check (auth.uid() = user_id);

-- friendships: visible to both sides, only requester can add/remove
create policy "View own friendships"        on friendships for select using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "Add friends"                 on friendships for insert with check (auth.uid() = user_id);
create policy "Remove friends"              on friendships for delete using (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- SEED DATA  (mirrors data.ts)
-- ─────────────────────────────────────────
insert into places (id, name, type, mood, personality, color_from, color_to, color_shadow, description, is_discover) values
  ('1', 'Beacon Hill Park',      'Park',       'peaceful',   'The gentle giant',    'from-emerald-300', 'to-teal-100',   'shadow-emerald-200', 'A sprawling sanctuary of ancient trees and quiet corners. It breathes slowly and deeply.',          false),
  ('2', 'Central Library',       'Library',    'quiet',      'The wise elder',      'from-indigo-300',  'to-purple-100', 'shadow-indigo-200',  'A hushed temple of stories. It hums with the soft sound of turning pages.',                        false),
  ('3', 'Old Town Pier',         'Waterfront', 'misses you', 'The quiet observer',  'from-blue-300',    'to-cyan-100',   'shadow-blue-200',    'Stretching out into the sea, it watches the tides come and go with melancholic patience.',           false),
  ('4', 'The Botanical Gardens', 'Garden',     'calm',       'The playful spirit',  'from-rose-300',    'to-orange-100', 'shadow-rose-200',    'A vibrant burst of color and life. It dances gently in the breeze, eager to show you its blooms.',   true),
  ('5', 'Midnight Cafe',         'Cafe',       'lonely',     'The energetic heart', 'from-amber-300',   'to-yellow-100', 'shadow-amber-200',   'A warm glow in the dark streets. It thrives on quiet conversations and the smell of roasted beans.', true);

-- NOTE: capsules and chat_messages reference real user UUIDs from auth.users,
-- so they can only be seeded after real accounts exist.
-- To seed test capsules, create a user in Supabase Auth first, then run:
--
--   insert into capsules (place_id, author_id, type, content, media_url, color, created_at) values
--     ('1', '<your-user-uuid>', 'text', 'The cherry blossoms are finally blooming.', null, 'bg-emerald-50', now());
