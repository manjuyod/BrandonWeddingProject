import { Link, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import Details from "./pages/Details";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Registry from "./pages/Registry";
import RSVP from "./pages/RSVP";
import Travel from "./pages/Travel";

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Nicole and Brandon</h1>
        <p>Wedding site shell</p>
      </header>
      <nav className="app-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/details">Details</Link>
          </li>
          <li>
            <Link to="/travel">Travel</Link>
          </li>
          <li>
            <Link to="/registry">Registry</Link>
          </li>
          <li>
            <Link to="/rsvp">RSVP</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>
            <Link to="/admin/users">Admin Users</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/registry" element={<Registry />} />
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
