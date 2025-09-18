// import React, { useState, useEffect } from 'react';
// import { Header } from './components/Layout/Header';
// import { Footer } from './components/Layout/Footer';
// import { HomePage } from './components/Home/HomePage';
// import { LoginForm } from './components/Auth/LoginForm';
// import RegisterForm from './components/Auth/RegisterForm';
// import { DonorSearch } from './components/Search/DonorSearch';
// import { UserDashboard } from './components/Dashboard/UserDashboard';
// import { AdminPanel } from './components/Admin/AdminPanel';
// import { useAuth } from './hooks/useAuth';
// import { storageUtils } from './utils/storage';

// function App() {
//   const { user, isAuthenticated, loading, login, register, logout, updateUser } = useAuth();
//   const [currentPage, setCurrentPage] = useState('home');

//   // Debug effect to track user changes
//   useEffect(() => {
//     console.log('App: User state changed:', user);
//     console.log('App: Is authenticated:', isAuthenticated);
//   }, [user, isAuthenticated]);

//   useEffect(() => {
//     // Initialize sample data
//     try {
//       storageUtils.initializeSampleData();
//       console.log('App: Sample data initialized');
//     } catch (error) {
//       console.error('App: Failed to initialize sample data:', error);
//     }
//   }, []);

//   const handleLogin = async (email: string, password: string) => {
//     console.log('App: Handling login...');
//     const result = await login(email, password);
    
//     if (result.success) {
//       console.log('App: Login successful, redirecting...');
//       // User রোল অনুযায়ী redirect করুন
//       if (user?.role === 'admin') {
//         setCurrentPage('admin');
//       } else if (user?.role === 'donor' || user?.role === 'recipient') {
//         setCurrentPage('dashboard');
//       } else {
//         setCurrentPage('home');
//       }
//     } else {
//       console.log('App: Login failed:', result.error);
//     }
    
//     return result;
//   };

//   const handleRegister = async (userData: any) => {
//     console.log('App: Handling registration...');
//     console.log('App: Registration data received:', userData);
    
//     const result = await register(userData);
    
//     if (result.success) {
//       console.log('App: Registration successful');
      
//       // যদি auto-login successful হয়, তাহলে role based redirect করুন
//       if (result.autoLogin && result.user) {
//         const currentUser = result.user;
//         console.log('App: Auto-login successful, redirecting based on role:', currentUser.role);
        
//         setTimeout(() => {
//           if (currentUser.role === 'admin') {
//             setCurrentPage('admin');
//           } else if (currentUser.role === 'donor' || currentUser.role === 'recipient') {
//             setCurrentPage('dashboard');
//           } else {
//             setCurrentPage('home');
//           }
//         }, 2000);
//       } else if (result.autoLogin && !result.user) {
//         // Auto-login successful কিন্তু user data পাওয়া যায়নি, useAuth state check করি
//         console.log('App: Auto-login successful but no user data, checking auth state...');
//         setTimeout(() => {
//           if (user) {
//             console.log('App: Found user in auth state:', user.role);
//             if (user.role === 'admin') {
//               setCurrentPage('admin');
//             } else if (user.role === 'donor' || user.role === 'recipient') {
//               setCurrentPage('dashboard');
//             } else {
//               setCurrentPage('home');
//             }
//           } else {
//             console.log('App: No user found, redirecting to home');
//             setCurrentPage('home');
//           }
//         }, 2000);
//       } else {
//         console.log('App: Auto-login failed, will redirect to login page from RegisterForm');
//         // Auto-login fail হলে RegisterForm component নিজেই login page এ redirect করবে
//       }
//     } else {
//       console.log('App: Registration failed:', result.error);
//     }
    
//     return result;
//   };

//   const handleLogout = () => {
//     console.log('App: Handling logout...');
//     logout();
//     setCurrentPage('home');
//   };

//   const handleNavigate = (page: string) => {
//     console.log('App: Navigating to:', page);
//     setCurrentPage(page);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading LifeBlood...</p>
//         </div>
//       </div>
//     );
//   }

//   const renderPage = () => {
//     console.log('App: Rendering page:', currentPage);
    
//     switch (currentPage) {
//       case 'login':
//         return (
//           <LoginForm
//             onLogin={handleLogin}
//             onNavigateToRegister={() => setCurrentPage('register')}
//           />
//         );
//       case 'register':
//         return (
//           <RegisterForm
//             onRegister={handleRegister}
//             onNavigateToLogin={() => setCurrentPage('login')}
//           />
//         );
//       case 'search':
//         return <DonorSearch currentUser={user} />;
//       case 'dashboard':
//         return user ? (
//           <UserDashboard user={user} onUpdateUser={updateUser} />
//         ) : (
//           <div className="min-h-screen flex items-center justify-center">
//             <div className="text-center">
//               <p className="text-gray-600 mb-4">Please log in to view your dashboard</p>
//               <button 
//                 onClick={() => setCurrentPage('login')}
//                 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 Go to Login
//               </button>
//             </div>
//           </div>
//         );
//       case 'admin':
//         return user?.role === 'admin' ? (
//           <AdminPanel currentUser={user} />
//         ) : (
//           <div className="min-h-screen flex items-center justify-center">
//             <div className="text-center">
//               <p className="text-red-600 mb-4">Access denied. Admin only.</p>
//               <button 
//                 onClick={() => setCurrentPage('home')}
//                 className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//               >
//                 Go to Home
//               </button>
//             </div>
//           </div>
//         );
//       case 'home':
//       default:
//         return (
//           <HomePage
//             onNavigate={handleNavigate}
//             isAuthenticated={isAuthenticated}
//           />
//         );
//     }
//   };

//   const showHeaderFooter = !['login', 'register'].includes(currentPage);

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {showHeaderFooter && (
//         <Header
//           user={user}
//           onLogout={handleLogout}
//           currentPage={currentPage}
//           onNavigate={handleNavigate}
//         />
//       )}
      
//       <main className="flex-1">
//         {renderPage()}
//       </main>
      
//       {showHeaderFooter && <Footer />}
//     </div>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HomePage } from './components/Home/HomePage';
import { LoginForm } from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { DonorSearch } from './components/Search/DonorSearch';
import { UserDashboard } from './components/Dashboard/UserDashboard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { useAuth } from './hooks/useAuth';
import { storageUtils } from './utils/storage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied. Insufficient permissions.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }
  
  return children;
};

// Auth Route Component (redirects if already logged in)
const AuthRoute = ({ children, user }) => {
  if (user) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role === 'donor' || user.role === 'recipient') {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main App Content Component
function AppContent() {
  const { user, isAuthenticated, loading, login, register, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug effect to track user changes
  useEffect(() => {
    console.log('App: User state changed:', user);
    console.log('App: Is authenticated:', isAuthenticated);
    console.log('App: Current path:', location.pathname);
  }, [user, isAuthenticated, location.pathname]);

  useEffect(() => {
    // Initialize sample data
    try {
      storageUtils.initializeSampleData();
      console.log('App: Sample data initialized');
    } catch (error) {
      console.error('App: Failed to initialize sample data:', error);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    console.log('App: Handling login...');
    const result = await login(email, password);
    
    if (result.success) {
      console.log('App: Login successful, redirecting...');
      // User রোল অনুযায়ী redirect করুন
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user?.role === 'donor' || user?.role === 'recipient') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      console.log('App: Login failed:', result.error);
    }
    
    return result;
  };

  const handleRegister = async (userData: any) => {
    console.log('App: Handling registration...');
    console.log('App: Registration data received:', userData);
    
    const result = await register(userData);
    
    if (result.success) {
      console.log('App: Registration successful');
      
      // যদি auto-login successful হয়, তাহলে role based redirect করুন
      if (result.autoLogin && result.user) {
        const currentUser = result.user;
        console.log('App: Auto-login successful, redirecting based on role:', currentUser.role);
        
        setTimeout(() => {
          if (currentUser.role === 'admin') {
            navigate('/admin', { replace: true });
          } else if (currentUser.role === 'donor' || currentUser.role === 'recipient') {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 2000);
      } else if (result.autoLogin && !result.user) {
        // Auto-login successful কিন্তু user data পাওয়া যায়নি, useAuth state check করি
        console.log('App: Auto-login successful but no user data, checking auth state...');
        setTimeout(() => {
          if (user) {
            console.log('App: Found user in auth state:', user.role);
            if (user.role === 'admin') {
              navigate('/admin', { replace: true });
            } else if (user.role === 'donor' || user.role === 'recipient') {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          } else {
            console.log('App: No user found, redirecting to home');
            navigate('/', { replace: true });
          }
        }, 2000);
      } else {
        console.log('App: Auto-login failed, will redirect to login page from RegisterForm');
        // Auto-login fail হলে RegisterForm component নিজেই login page এ redirect করবে
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    } else {
      console.log('App: Registration failed:', result.error);
    }
    
    return result;
  };

  const handleLogout = () => {
    console.log('App: Handling logout...');
    logout();
    navigate('/', { replace: true });
  };

  const handleNavigate = (page: string) => {
    console.log('App: Navigating to:', page);
    
    // Convert page names to routes
    const routeMap = {
      'home': '/',
      'login': '/login',
      'register': '/register',
      'search': '/search',
      'dashboard': '/dashboard',
      'admin': '/admin'
    };
    
    const route = routeMap[page] || '/';
    navigate(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading LifeBlood...</p>
        </div>
      </div>
    );
  }

  const showHeaderFooter = !['/login', '/register'].includes(location.pathname);
  const currentPage = location.pathname.substring(1) || 'home'; // Remove leading slash

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeaderFooter && (
        <Header
          user={user}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <HomePage
                onNavigate={handleNavigate}
                isAuthenticated={isAuthenticated}
              />
            } 
          />
          
          <Route 
            path="/search" 
            element={<DonorSearch currentUser={user} />} 
          />
          
          {/* Auth Routes (redirect if already logged in) */}
          <Route 
            path="/login" 
            element={
              <AuthRoute user={user}>
                <LoginForm
                  onLogin={handleLogin}
                  onNavigateToRegister={() => navigate('/register')}
                />
              </AuthRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <AuthRoute user={user}>
                <RegisterForm
                  onRegister={handleRegister}
                  onNavigateToLogin={() => navigate('/login')}
                />
              </AuthRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['donor', 'recipient', 'admin']}>
                <UserDashboard user={user} onUpdateUser={updateUser} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <AdminPanel currentUser={user} />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {showHeaderFooter && <Footer />}
    </div>
  );
}

// Main App Component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;