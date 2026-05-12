import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    try {
      const { signUpWithEmail } = await import("../lib/auth");
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setStatus(error.message);
        return;
      }
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Unable to create account.",
      );
      return;
    }

    setStatus("Account created. You can now sign in.");
    navigate("/login");
  }

  return (
    <main>
      <h2>Register</h2>
      <form className="form-layout" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
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
        <button type="submit">Create account</button>
      </form>
      {status ? <p>{status}</p> : null}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}
