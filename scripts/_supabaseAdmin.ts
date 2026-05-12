import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

const required = ["VITE_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
const [supabaseUrlEnv, serviceRoleEnv] = required.map(
  (name) => process.env[name],
);

if (!supabaseUrlEnv || !serviceRoleEnv) {
  const missing = required.filter((name) => !process.env[name]);
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. ` +
      "Populate them in .env and rerun.",
  );
}

export const supabaseAdmin = createClient(supabaseUrlEnv, serviceRoleEnv);
