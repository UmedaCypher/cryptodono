-- supabase/migrations/YYYYMMDDHHMMSS_create_profiles_and_rls.sql

-- Création de la table "profiles"
create table public.profiles (
  id uuid not null,
  updated_at timestamp with time zone,
  username text,
  description text,
  constraint username_length check (char_length(username) >= 3)
);

-- Définition de la clé primaire
alter table public.profiles 
  add constraint profiles_pkey primary key (id);

-- Liaison avec la table des utilisateurs de Supabase Auth
alter table public.profiles 
  add constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade;

-- Activation de la Row Level Security (RLS) pour la table
alter table public.profiles 
  enable row level security;

-- Création de la politique pour la LECTURE (SELECT)
-- Permet aux utilisateurs de ne voir que leur propre profil.
create policy "Allow individual read access"
  on public.profiles for select
  using (auth.uid() = id);

-- Création de la politique pour la MISE À JOUR (UPDATE)
-- Permet aux utilisateurs de ne mettre à jour que leur propre profil.
create policy "Allow individual update access"
  on public.profiles for update
  using (auth.uid() = id);

-- Création de la fonction qui s'exécutera à chaque nouvelle inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Création du déclencheur (trigger) qui appelle la fonction
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();