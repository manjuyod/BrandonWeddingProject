import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmail, signInWithGoogle } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const { error } = await signInWithEmail(email, password);
    if (error) {
      setStatus(error.message);
      return;
    }

    setStatus("Signed in.");
  }

  async function handleGoogle() {
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus(error.message);
    }
  }

  return (
    <main>
      <h2>Login</h2>
      <form className="form-layout" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button type="submit">Sign in</button>
      </form>
      <button type="button" onClick={handleGoogle}>
        Continue with Google
      </button>
      {status ? <p>{status}</p> : null}
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}
