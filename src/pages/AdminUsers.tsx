import { useEffect, useState } from "react";
import type { WeddingUser } from "../types/user";
import { getAdminStats, getAllUsersForAdmin } from "../lib/users";
import type { AdminStats } from "../lib/users";

export default function AdminUsers() {
  const [users, setUsers] = useState<WeddingUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [allUsers, allStats] = await Promise.all([
        getAllUsersForAdmin(),
        getAdminStats(),
      ]);

      if (cancelled) {
        return;
      }

      setUsers(allUsers);
      setStats(allStats);
      setLoading(false);
    };

    load().catch(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <h2>Admin Users</h2>
      {loading ? <p>Loading users...</p> : null}
      {stats ? (
        <p>
          Total: {stats.totalGuests}, Attending: {stats.attending}, Declined:{" "}
          {stats.notAttending}, Pending: {stats.pending}, Children:{" "}
          {stats.children}, Tables: {stats.assignedTables}
        </p>
      ) : null}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name} ({user.email ?? "no-email"})
          </li>
        ))}
      </ul>
    </main>
  );
}
