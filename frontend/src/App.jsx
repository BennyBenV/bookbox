import {Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import { Link } from 'react-router-dom';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Dashboard from './pages/Dashboard';
import SearchBooks from './pages/SearchBooks';
import AddBook from './pages/AddBook';
import BookDetails from './pages/BookDetails';
import BookPage from './pages/BookPage';
import Stats from './pages/Stats';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';

export default function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <p>Chargement...</p>;

  return(
    <>

      <Header />
      <Routes>
        {/* <Route path="/" element={ isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" /> } /> */}

        { /* Pages publiques */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        { /* Pages privées */}
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout> </ProtectedRoute>} />
        <Route path="/add-book" element={<ProtectedRoute><AppLayout><AddBook /></AppLayout> </ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><AppLayout><SearchBooks /></AppLayout></ProtectedRoute> } />
        <Route path="/book/:olid" element={<ProtectedRoute><AppLayout><BookDetails /> </AppLayout></ProtectedRoute>} />
        <Route path="/books/:id" element={<ProtectedRoute><AppLayout><BookPage /></AppLayout></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><AppLayout><Stats /></AppLayout> </ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout> </ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><AppLayout><SearchResults /></AppLayout> </ProtectedRoute>} />

        { /* Redirection */}
      </Routes>
    </>
  )
}