import {Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import { Link } from 'react-router-dom';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

export default function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  return(
    <>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
        {isAuthenticated && (
          <>
            {" |" }
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}