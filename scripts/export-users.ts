import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { supabaseAdmin } from "./_supabaseAdmin";

type StatusFilter = "pending" | "attending" | "declined" | "all";

const columns = [
  "id",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address_1",
  "address_2",
  "city",
  "state",
  "zip_code",
  "country",
  "guest_of",
  "guest_tag",
  "invited",
  "is_child",
  "is_plus_one",
  "plus_one_allowed",
  "invite_code",
  "rsvp",
  "rsvp_submitted_at",
  "meal_choice",
  "dietary_notes",
  "song_request",
  "table_number",
  "role",
  "notes",
  "admin_notes",
  "created_at",
  "updated_at",
] as const;

type ExportUserRow = Record<(typeof columns)[number], unknown>;

const args = parseExportArgs(process.argv.slice(2));

const statusFilters = [args.pending, args.attending, args.declined].filter(
  Boolean,
);
if (statusFilters.length > 1) {
  console.error(
    "Use at most one of --attending, --declined, or --pending at a time.",
  );
  process.exit(1);
}

const statusFilter: StatusFilter = args.attending
  ? "attending"
  : args.declined
    ? "declined"
    : args.pending
      ? "pending"
      : "all";

const users = await fetchUsers(statusFilter);
const outPath = args.out ?? join(process.cwd(), "exports", "users.csv");

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, buildCsv(users), "utf8");

console.log(`Exported ${users.length} users to ${outPath}`);

async function fetchUsers(
  statusFilter: StatusFilter,
): Promise<ExportUserRow[]> {
  let query = supabaseAdmin.from("users").select(columns.join(","));

  if (statusFilter === "attending") {
    query = query.eq("rsvp", true);
  } else if (statusFilter === "declined") {
    query = query.eq("rsvp", false);
  } else if (statusFilter === "pending") {
    query = query.is("rsvp", null);
  }

  const { data, error } = await query.order("last_name").order("first_name");
  if (error) {
    console.error(`Failed to export users: ${error.message}`);
    process.exit(1);
  }

  return (data ?? []) as unknown as ExportUserRow[];
}

function buildCsv(rows: ExportUserRow[]): string {
  const output = [columns.join(",")];

  for (const row of rows) {
    output.push(
      columns.map((column) => csvEscape(formatValue(row[column]))).join(","),
    );
  }

  return `${output.join("\n")}\n`;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function csvEscape(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

function parseExportArgs(argv: string[]): {
  out?: string;
  attending: boolean;
  pending: boolean;
  declined: boolean;
} {
  const flags: {
    out?: string;
    attending: boolean;
    pending: boolean;
    declined: boolean;
  } = {
    attending: false,
    pending: false,
    declined: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--out") {
      if (!next || next.startsWith("--")) {
        console.error("--out requires a value.");
        process.exit(1);
      }
      flags.out = next;
      i += 1;
      continue;
    }

    if (arg.startsWith("--out=")) {
      flags.out = arg.slice("--out=".length);
      continue;
    }

    if (arg === "--attending") {
      flags.attending = true;
      continue;
    }

    if (arg === "--declined") {
      flags.declined = true;
      continue;
    }

    if (arg === "--pending") {
      flags.pending = true;
      continue;
    }

    console.error(`Unknown argument: ${arg}`);
    process.exit(1);
  }

  return flags;
}
