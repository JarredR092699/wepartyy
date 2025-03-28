import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import FindServicePage from './pages/FindServicePage';
import MyEventsPage from './pages/MyEventsPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ManageServicesPage from './pages/ManageServicesPage';
import MessagesPage from './pages/MessagesPage';
import VendorVerificationPage from './pages/VendorVerificationPage';
import PaymentPage from './pages/PaymentPage';
import EventDetailsPage from './pages/EventDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import ServiceListPage from './pages/ServiceListPage';
import CreateServicePage from './pages/CreateServicePage';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Home route that redirects service providers to their dashboard
const HomeRoute = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (isAuthenticated && currentUser && currentUser.role !== 'eventOrganizer' && currentUser.role !== 'publicUser') {
    return <Navigate to="/my-events" />;
  }
  
  return <HomePage />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-event" element={
        <ProtectedRoute>
          <CreateEventPage />
        </ProtectedRoute>
      } />
      <Route path="/find-service" element={<FindServicePage />} />
      <Route path="/services/:serviceType" element={<ServiceListPage />} />
      <Route path="/my-events" element={
        <ProtectedRoute>
          <MyEventsPage />
        </ProtectedRoute>
      } />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <FavoritesPage />
        </ProtectedRoute>
      } />
      <Route path="/manage-services" element={
        <ProtectedRoute>
          <ManageServicesPage />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <MessagesPage />
        </ProtectedRoute>
      } />
      <Route path="/vendor-verification" element={
        <ProtectedRoute>
          <VendorVerificationPage />
        </ProtectedRoute>
      } />
      <Route path="/my-events" element={
        <ProtectedRoute>
          <MyEventsPage />
        </ProtectedRoute>
      } />
      <Route path="/payment" element={
        <ProtectedRoute>
          <PaymentPage />
        </ProtectedRoute>
      } />
      <Route path="/event/:eventId" element={<EventDetailsPage />} />
      <Route path="/create-service" element={
        <ProtectedRoute>
          <CreateServicePage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <FavoritesProvider>
          <AppRoutes />
        </FavoritesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
