import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SubmitExperience from "./pages/SubmitExperience";
import Analytics from "./pages/Analytics";
import BrowseExperiences from './pages/BrowseExperiences';
import Questions from './components/Questions';


import BottomNav from "./components/BottomNav";
import ErrorBoundary from "./components/ErrorBoundary";

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <main className={isHomePage ? "" : "container mx-auto px-4 py-8 pb-20"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitExperience />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/browse" element={<BrowseExperiences />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App
