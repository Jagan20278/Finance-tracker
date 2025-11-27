import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <>
      {token && (
        <button 
          onClick={logout} 
          style={{position:'absolute', top: 20, right: 20, background: '#ef4444', color: 'white', padding: '8px 15px', border:'none', borderRadius: '5px', cursor: 'pointer'}}>
          Logout
        </button>
      )}
      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;