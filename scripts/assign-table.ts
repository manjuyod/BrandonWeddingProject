import { supabaseAdmin } from "./_supabaseAdmin";

const args = parseAssignArgs(process.argv.slice(2));

if (args.identifiers.length !== 1) {
  console.error(
    "Specify exactly one identifier: --id, --email, or --invite-code.",
  );
  process.exit(1);
}

if (args.actions.length !== 1) {
  console.error("Specify exactly one action: --table or --clear.");
  process.exit(1);
}

const { key, value } = args.identifiers[0];
const table = args.actions[0];

const matching = await supabaseAdmin
  .from("users")
  .select("id,first_name,last_name,email,invite_code")
  .eq(key, value);

if (matching.error) {
  console.error("Failed to locate user:", matching.error.message);
  process.exit(1);
}

const users = matching.data ?? [];
if (users.length === 0) {
  console.error("No user matched the identifier.");
  process.exit(1);
}

if (users.length > 1) {
  console.error(
    "Identifier is not unique. Narrow match by using a unique email/invite code or --id.",
  );
  process.exit(1);
}

const selected = users[0];

const updates =
  table.type === "clear"
    ? { table_number: null }
    : { table_number: table.value };

const { error } = await supabaseAdmin
  .from("users")
  .update(updates)
  .eq("id", selected.id);

if (error) {
  console.error("Failed to assign table:", error.message);
  process.exit(1);
}

const name = [selected.first_name, selected.last_name]
  .filter(Boolean)
  .join(" ");
const target = table.type === "clear" ? "unassigned" : `table ${table.value}`;
console.log(
  `Updated table assignment for ${name || selected.email || selected.id}: ${target}.`,
);

type IdentifierKey = "id" | "email" | "invite_code";
type TableAction = { type: "set"; value: number } | { type: "clear" };

type ParsedArgs = {
  identifiers: Array<{ key: IdentifierKey; value: string }>;
  actions: TableAction[];
};

function parseAssignArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = { identifiers: [], actions: [] };
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--id") {
      if (!next || next.startsWith("--")) {
        console.error("--id requires a value.");
        process.exit(1);
      }
      parsed.identifiers.push({ key: "id", value: next });
      i += 2;
      continue;
    }

    if (arg === "--email") {
      if (!next || next.startsWith("--")) {
        console.error("--email requires a value.");
        process.exit(1);
      }
      parsed.identifiers.push({ key: "email", value: next });
      i += 2;
      continue;
    }

    if (arg === "--invite-code") {
      if (!next || next.startsWith("--")) {
        console.error("--invite-code requires a value.");
        process.exit(1);
      }
      parsed.identifiers.push({ key: "invite_code", value: next });
      i += 2;
      continue;
    }

    if (arg.startsWith("--id=")) {
      parsed.identifiers.push({
        key: "id",
        value: arg.slice("--id=".length),
      });
      i += 1;
      continue;
    }

    if (arg.startsWith("--email=")) {
      parsed.identifiers.push({
        key: "email",
        value: arg.slice("--email=".length),
      });
      i += 1;
      continue;
    }

    if (arg.startsWith("--invite-code=")) {
      parsed.identifiers.push({
        key: "invite_code",
        value: arg.slice("--invite-code=".length),
      });
      i += 1;
      continue;
    }

    if (arg === "--table") {
      if (!next || next.startsWith("--")) {
        console.error("--table requires a value.");
        process.exit(1);
      }

      const value = parseTableNumber(next);
      if (value === null) {
        console.error(`Invalid table number: ${next}`);
        process.exit(1);
      }
      parsed.actions.push({ type: "set", value });
      i += 2;
      continue;
    }

    if (arg.startsWith("--table=")) {
      const raw = arg.slice("--table=".length);
      const value = parseTableNumber(raw);
      if (value === null) {
        console.error(`Invalid table number: ${raw}`);
        process.exit(1);
      }
      parsed.actions.push({ type: "set", value });
      i += 1;
      continue;
    }

    if (arg === "--clear") {
      parsed.actions.push({ type: "clear" });
      i += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }

    i += 1;
  }

  return parsed;
}

function parseTableNumber(raw: string): number | null {
  const normalized = raw.trim();
  const parsed = Number.parseFloat(normalized);
  return Number.isInteger(parsed) ? parsed : null;
}
