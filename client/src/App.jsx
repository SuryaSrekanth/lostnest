import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportItem from './pages/ReportItem';
import MyListings from './pages/MyListings';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
          {/* Hardware-Accelerated Ambient Dot Pattern (zero scroll-jank GPU layer) */}
          <div
            className="pointer-events-none fixed inset-0 -z-10 opacity-70"
            style={{
              backgroundImage: 'radial-gradient(rgba(6, 78, 59, 0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              transform: 'translateZ(0)',
            }}
          />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Protected Employee Routes */}
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <ReportItem />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listings"
                element={
                  <ProtectedRoute>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;