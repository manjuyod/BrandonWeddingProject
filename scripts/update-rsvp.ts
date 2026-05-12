import { supabaseAdmin } from "./_supabaseAdmin";

const args = parseUpdateArgs(process.argv.slice(2));

if (args.identifiers.length !== 1) {
  console.error(
    "Specify exactly one identifier: --id, --email, or --invite-code.",
  );
  process.exit(1);
}

if (args.actions.length !== 1) {
  console.error("Specify exactly one action: --yes, --no, or --clear.");
  process.exit(1);
}

const { key, value } = args.identifiers[0];
const action = args.actions[0];

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
  action === "clear"
    ? { rsvp: null, rsvp_submitted_at: null }
    : action === "yes"
      ? { rsvp: true, rsvp_submitted_at: new Date().toISOString() }
      : { rsvp: false, rsvp_submitted_at: new Date().toISOString() };

const { error } = await supabaseAdmin
  .from("users")
  .update(updates)
  .eq("id", selected.id as string);

if (error) {
  console.error("Failed to update RSVP:", error.message);
  process.exit(1);
}

const name = [selected.first_name, selected.last_name]
  .filter(Boolean)
  .join(" ");
console.log(
  `Updated RSVP for ${name || selected.email || selected.id}: ` +
    `rsvp -> ${action === "yes" ? "Attending" : action === "no" ? "Declined" : "Pending"}`,
);

type IdentifierKey = "id" | "email" | "invite_code";
type Action = "yes" | "no" | "clear";

type ParsedArgs = {
  identifiers: Array<{ key: IdentifierKey; value: string }>;
  actions: Action[];
};

function parseUpdateArgs(argv: string[]): ParsedArgs {
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
      const email = arg.slice("--email=".length);
      parsed.identifiers.push({ key: "email", value: email });
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

    if (arg === "--yes") {
      parsed.actions.push("yes");
      i += 1;
      continue;
    }

    if (arg === "--no") {
      parsed.actions.push("no");
      i += 1;
      continue;
    }

    if (arg === "--clear") {
      parsed.actions.push("clear");
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
