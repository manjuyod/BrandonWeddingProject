export type UserRole = "admin" | "couple" | "planner" | "guest";

export interface WeddingUser {
  id: number;
  auth_user_id: string | null;

  first_name: string;
  last_name: string;

  email: string | null;
  phone: string | null;

  address_1: string | null;
  address_2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;

  guest_of: string | null;
  guest_tag: string | null;

  invited: boolean;
  is_child: boolean;
  is_plus_one: boolean;
  plus_one_allowed: boolean;

  invite_code: string | null;

  rsvp: boolean | null;
  rsvp_submitted_at: string | null;

  meal_choice: string | null;
  dietary_notes: string | null;
  song_request: string | null;

  table_number: number | null;

  role: UserRole;

  notes: string | null;
  admin_notes: string | null;

  created_at: string;
  updated_at: string;
}
