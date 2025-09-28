-- Création de la politique pour l'INSERTION (INSERT)
-- Permet à un utilisateur de créer son propre profil, et uniquement le sien.
create policy "Allow individual insert access"
  on public.profiles for insert
  with check (auth.uid() = id);