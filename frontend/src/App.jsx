// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext, lazy, Suspense } from 'react';
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
// import PublicUser from './pages/PublicUser';

// ⚡ Lazy load des pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SearchBooks = lazy(() => import("./pages/SearchBooks"));
const AddBook = lazy(() => import("./pages/AddBook"));
const BookDetails = lazy(() => import("./pages/BookDetails"));
const BookPage = lazy(() => import("./pages/BookPage"));
const Stats = lazy(() => import("./pages/Stats"));
const Home = lazy(() => import("./pages/Home"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const PublicUser = lazy(() => import ('./pages/PublicUser'));


export default function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <Header />
      <Suspense fallback={<p>Chargement...</p>}>
        <Routes>

          {/* ✅ Pages publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Pages privées (auth requise) */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout><Home /></AppLayout>
            </ProtectedRoute>
          } />


          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/add-book" element={
            <ProtectedRoute>
              <AppLayout><AddBook /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <AppLayout><SearchBooks /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/book/:id" element={
            <ProtectedRoute>
              <AppLayout><BookDetails /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/books/:id" element={
            <ProtectedRoute>
              <AppLayout><BookPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <AppLayout><Stats /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <AppLayout><SearchResults /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/user" element={
            <ProtectedRoute>
              <AppLayout><EditProfile /></AppLayout>
            </ProtectedRoute>
          } />
          <Route caseSensitive={false} path="/user/:username" element={
            <ProtectedRoute>
              <AppLayout><PublicUser /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ✅ Redirections & fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </Suspense>
    </>
  );
}
