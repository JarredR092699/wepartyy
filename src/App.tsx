import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import CreateEventPage from './pages/CreateEventPage';
import FindServicePage from './pages/FindServicePage';
import MyEventsPage from './pages/MyEventsPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/find-service" element={<FindServicePage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
