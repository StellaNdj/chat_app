import './App.css';
import AuthProvider from './contexts/AuthContext';
import Homepage from './pages/Homepage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ThemeProvider from './contexts/ThemeContext';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public routes */}
            <Route path='/' element={<Homepage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>

            {/* Private routes */}
            <Route element={<ProtectedRoute/>}>
              <Route path='/dashboard' element={<Dashboard/>}/>
            </Route>
            <Route element={<ProtectedRoute/>}>
              <Route path='/profile' element={<Profile/>}/>
            </Route>

          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
