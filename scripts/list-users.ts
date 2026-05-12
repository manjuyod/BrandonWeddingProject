import { supabaseAdmin } from "./_supabaseAdmin";

type StatusFilter = "pending" | "attending" | "declined" | "all";

type CliArgs = {
  pending: boolean;
  attending: boolean;
  declined: boolean;
  children: boolean;
};

const args = parseListArgs(process.argv.slice(2));

const statusFilters = [args.attending, args.declined, args.pending].filter(
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

const users = await fetchUsers(statusFilter, args.children);

if (users.length === 0) {
  console.log("No users found.");
  process.exit(0);
}

const header = "Name | Email | RSVP | Child | Table | Tag | Role";
console.log(header);

for (const user of users) {
  const name = formatName(user.first_name, user.last_name);
  const row = [
    name,
    user.email ?? "",
    formatRsvp(user.rsvp),
    formatBoolean(user.is_child),
    user.table_number === null || user.table_number === undefined
      ? ""
      : String(user.table_number),
    user.guest_tag ?? "",
    user.role ?? "",
  ];
  console.log(row.join(" | "));
}

async function fetchUsers(
  statusFilter: StatusFilter,
  includeChildrenOnly: boolean,
) {
  let query = supabaseAdmin
    .from("users")
    .select(
      "first_name,last_name,email,rsvp,is_child,table_number,guest_tag,role",
    );

  if (includeChildrenOnly) {
    query = query.eq("is_child", true);
  }

  if (statusFilter === "attending") {
    query = query.eq("rsvp", true);
  } else if (statusFilter === "declined") {
    query = query.eq("rsvp", false);
  } else if (statusFilter === "pending") {
    query = query.is("rsvp", null);
  }

  const { data, error } = await query.order("last_name").order("first_name");
  if (error) {
    console.error("Failed to fetch users:", error.message);
    process.exit(1);
  }

  return data ?? [];
}

function formatName(firstName: string | null, lastName: string | null): string {
  const parts = [firstName, lastName].filter(Boolean);
  if (parts.length === 0) {
    return "";
  }

  return parts.join(" ");
}

function formatRsvp(rsvp: boolean | null): string {
  if (rsvp === true) {
    return "Attending";
  }

  if (rsvp === false) {
    return "Declined";
  }

  return "Pending";
}

function formatBoolean(value: boolean | null): string {
  return value ? "Yes" : "No";
}

function parseListArgs(argv: string[]): CliArgs {
  const args = new Set(argv);

  return {
    pending: args.has("--pending"),
    attending: args.has("--attending"),
    declined: args.has("--declined"),
    children: args.has("--children"),
  };
}
