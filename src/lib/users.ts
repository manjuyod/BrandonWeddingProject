import type { WeddingUser } from "../types/user";
import { getCurrentAuthUser } from "./auth";
import { supabase } from "./supabase";

export interface AdminStats {
  totalGuests: number;
  attending: number;
  notAttending: number;
  pending: number;
  children: number;
  assignedTables: number;
}

export async function getCurrentWeddingUser(): Promise<WeddingUser | null> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUser.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as WeddingUser | null;
}

export async function getAllUsersForAdmin(): Promise<WeddingUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as WeddingUser[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const users = await getAllUsersForAdmin();

  return {
    totalGuests: users.length,
    attending: users.filter((user) => user.rsvp === true).length,
    notAttending: users.filter((user) => user.rsvp === false).length,
    pending: users.filter((user) => user.rsvp === null).length,
    children: users.filter((user) => user.is_child).length,
    assignedTables: users.filter((user) => user.table_number !== null).length,
  };
}

export async function upsertUserAfterRegistration(input: {
  firstName: string;
  lastName: string;
  email?: string | null;
}): Promise<WeddingUser | null> {
  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return null;
  }

  const payload = {
    auth_user_id: authUser.id,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email ?? authUser.email ?? null,
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(payload, { onConflict: "auth_user_id" })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as WeddingUser;
}
