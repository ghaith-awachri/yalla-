import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Concept from './pages/Concept';
import ForProfessionals from './pages/ForProfessionals';
import ForCandidates from './pages/ForCandidates';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/Admindashboard';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/concept" element={<Concept />} />
            <Route path="/professionals" element={<ForProfessionals />} />
            <Route path="/candidates" element={<ForCandidates />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Legacy dashboard route - redirects based on user type */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredUserType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Candidate routes */}
            <Route 
              path="/candidate/dashboard" 
              element={
                <ProtectedRoute requiredUserType="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Employer routes */}
            <Route 
              path="/employer/dashboard" 
              element={
                <ProtectedRoute requiredUserType="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;