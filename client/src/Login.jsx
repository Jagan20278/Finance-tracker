import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ setToken }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/register' : '/login';
    try {
      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, { username, password });
      
      if (!isRegister) {
         localStorage.setItem('token', res.data.token);
         setToken(res.data.token);
         toast.success("Welcome back!");
         navigate('/');
      } else {
         toast.success("Registration successful! Now Login.");
         setIsRegister(false);
         setUsername('');
         setPassword('');
      }
    } catch (err) { 
      toast.error(err.response?.data?.error || "An error occurred"); 
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100%' 
    }}>
      <ToastContainer position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="card"
        style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
      >
        <div className="header" style={{marginBottom: '20px'}}>
            <h2 style={{fontSize: '2rem', margin: 0}}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{color: 'Black', opacity: 0.8}}>
                {isRegister ? 'Join FinanceFlow today' : 'Enter your credentials to access'}
            </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{color: 'Black', opacity: 0.9}}>Username</label>
            <input 
                className="custom-input" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder="Enter username"
                required 
            />
          </div>
          
          <div className="input-group">
            <label style={{color: 'Black', opacity: 0.9}}>Password</label>
            <input 
                type="password" 
                className="custom-input" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
            />
          </div>

          <button 
            className="submit-btn" 
            style={{
                marginTop: '10px', 
                background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
            }}
          >
            {isRegister ? 'Sign Up' : 'Login to Dashboard'}
          </button>
        </form>

        <p 
            style={{
                marginTop: '20px', 
                textAlign: 'center', 
                cursor: 'pointer', 
                color: 'Black', 
                textDecoration: 'underline',
                opacity: 0.9
            }} 
            onClick={() => setIsRegister(!isRegister)}
        >
           {isRegister ? 'Already have an account? Login' : 'New here? Create an account'}
        </p>
       </motion.div>
    </div>
  );
}

export default Login;