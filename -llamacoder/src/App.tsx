import { useState, useEffect } from 'react';
import { PublicForm } from './components/PublicForm';
import { AdminDashboard } from './components/AdminDashboard';
import { PasswordPrompt } from './components/PasswordPrompt';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const handleNavigation = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);
      
      // Reset admin auth when navigating away from admin
      if (newPath !== '/admin') {
        setIsAdminAuthenticated(false);
      }
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleNavigation);
    
    // Also check for hash changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleNavigation();
    };

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      history.pushState = originalPushState;
    };
  }, []);

  const handleAdminAuth = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
    } else {
      // Redirect back to home if authentication fails
      window.location.href = '/';
    }
  };

  const renderContent = () => {
    if (currentPath === '/admin') {
      if (!isAdminAuthenticated) {
        return <PasswordPrompt onAuthenticate={handleAdminAuth} />;
      }
      return <AdminDashboard />;
    }

    return <PublicForm />;
  };

  return <>{renderContent()}</>;
}

export default App;