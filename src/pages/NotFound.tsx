import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <h2>Not found</h2>
      <p>
        This page does not exist. <Link to="/">Go home</Link>
      </p>
    </main>
  );
}
