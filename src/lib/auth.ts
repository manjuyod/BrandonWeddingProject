import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: "google" });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentAuthUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
