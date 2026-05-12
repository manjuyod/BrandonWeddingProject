import { supabaseAdmin } from "./_supabaseAdmin";

const args = parseArgs(process.argv.slice(2));

const firstName = readRequired(args, "first");
const lastName = readRequired(args, "last");

const payload = removeUndefined({
  first_name: firstName,
  last_name: lastName,
  email: readOptional(args, "email"),
  phone: readOptional(args, "phone"),
  address_1: readOptional(args, "address-1"),
  address_2: readOptional(args, "address-2"),
  city: readOptional(args, "city"),
  state: readOptional(args, "state"),
  zip_code: readOptional(args, "zip-code"),
  country: readOptional(args, "country"),
  guest_of: readOptional(args, "guest-of"),
  guest_tag: readOptional(args, "tag"),
  is_child: readBoolean(args, "child", false),
  is_plus_one: readBoolean(args, "plus-one", false),
  plus_one_allowed: readBoolean(args, "plus-one-allowed", false),
  invited: readBoolean(args, "invited", true),
  invite_code: readOptional(args, "invite-code"),
  role: readOptional(args, "role") ?? "guest",
  notes: readOptional(args, "notes"),
  admin_notes: readOptional(args, "admin-notes"),
});

const { data, error } = await supabaseAdmin
  .from("users")
  .insert(payload)
  .select("id,first_name,last_name,email")
  .single();

if (error) {
  console.error(
    `Failed to create user ${firstName} ${lastName}: ${error.message}`,
  );
  process.exit(1);
}

console.log(
  `Created user ${data.first_name} ${data.last_name} (${data.email ?? "no email"}) with id ${data.id}.`,
);

function parseArgs(argv: string[]): Map<string, string> {
  const parsed = new Map<string, string>();
  const valueKeys = new Set([
    "first",
    "last",
    "email",
    "phone",
    "address-1",
    "address-2",
    "city",
    "state",
    "zip-code",
    "country",
    "guest-of",
    "tag",
    "invite-code",
    "role",
    "notes",
    "admin-notes",
  ]);
  const booleanKeys = new Set([
    "child",
    "plus-one",
    "plus-one-allowed",
    "invited",
  ]);

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith("--")) {
      console.error(`Unexpected argument: ${arg}`);
      process.exit(1);
    }

    const equalsIndex = arg.indexOf("=");
    if (equalsIndex > -1) {
      const key = arg.slice(2, equalsIndex);
      if (!valueKeys.has(key) && !booleanKeys.has(key)) {
        console.error(`Unknown argument: --${key}`);
        process.exit(1);
      }
      parsed.set(key, arg.slice(equalsIndex + 1));
      continue;
    }

    const key = arg.slice(2);
    if (!valueKeys.has(key) && !booleanKeys.has(key)) {
      console.error(`Unknown argument: --${key}`);
      process.exit(1);
    }

    const next = argv[i + 1];
    if (booleanKeys.has(key) && (next === undefined || next.startsWith("--"))) {
      parsed.set(key, "true");
      continue;
    }

    if (next === undefined || next.startsWith("--")) {
      console.error(`--${key} requires a value.`);
      process.exit(1);
    }

    parsed.set(key, next);
    i += 1;
  }

  return parsed;
}

function readRequired(args: Map<string, string>, key: string): string {
  const value = readOptional(args, key);
  if (!value) {
    console.error(`Missing required flag: --${key}`);
    process.exit(1);
  }

  return value;
}

function readOptional(
  args: Map<string, string>,
  key: string,
): string | undefined {
  const value = args.get(key)?.trim();
  return value ? value : undefined;
}

function readBoolean(
  args: Map<string, string>,
  key: string,
  fallback: boolean,
): boolean {
  const raw = args.get(key);
  if (raw === undefined) {
    return fallback;
  }

  const value = raw.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(value)) {
    return true;
  }

  if (["false", "0", "no", "n"].includes(value)) {
    return false;
  }

  console.error(`Invalid boolean value for --${key}: ${raw}`);
  process.exit(1);
}

function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as T;
}
