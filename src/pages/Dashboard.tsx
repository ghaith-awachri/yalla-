import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Redirect to appropriate dashboard based on user type
      switch (user.userType) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'candidate':
          navigate('/candidate/dashboard', { replace: true });
          break;
        case 'employer':
          navigate('/employer/dashboard', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Show loading while redirecting
  return (
    <div className="dashboard-container">
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p className="dashboard-loading-text">Redirection en cours...</p>
      </div>
    </div>
  );
};

export default Dashboard;