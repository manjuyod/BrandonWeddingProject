import { useEffect, useState } from "react";

export default function Admin() {
  const [userEmail, setUserEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let isMounted = true;
    import("../lib/auth")
      .then(({ getCurrentAuthUser }) => getCurrentAuthUser())
      .then((user) => {
        if (!isMounted) {
          return;
        }
        if (user?.email) {
          setUserEmail(user.email);
        }
      })
      .catch(() => {
        // noop
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSignOut() {
    try {
      const { signOut } = await import("../lib/auth");
      const { error } = await signOut();
      if (error) {
        setStatus(error.message);
        return;
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to sign out.");
      return;
    }

    setUserEmail("");
    setStatus("Signed out.");
  }

  return (
    <main>
      <h2>Admin</h2>
      <p>
        {userEmail
          ? `Signed in as ${userEmail}`
          : "No authenticated user detected."}
      </p>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>
      {status ? <p>{status}</p> : null}
    </main>
  );
}
