import { useState } from 'react';
import { authService } from '../services/api';
import { User, Lock, MoreHorizontal } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      window.location.href = '/'; 
    } catch (err: any) {
      console.error('Login error detail:', err);
      const msg = err.response?.data?.message || err.message || 'Invalid username or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo-container">
          <img src="/logo.jpg" alt="Yourstechhub" className="login-logo-img" style={{ maxWidth: '280px' }} />
        </div>

        <div className="login-form-container">
          <div className="avatar-container">
            <div className="avatar-circle">
              <User size={40} color="white" />
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group input-with-icon">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                name="username" 
                className="icon-input" 
                placeholder="admin@yourscrm.com" 
                required 
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group input-with-icon">
              <Lock className="input-icon" size={18} />
              <input 
                type="password" 
                name="password" 
                className="icon-input" 
                placeholder="••••••••" 
                required 
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-actions">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                Remember me
              </label>
              <a href="#" className="forgot-password">Forgot your password?</a>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
            
            <div className="pagination-dots">
              <MoreHorizontal size={24} color="#0f172a" />
            </div>
          </form>
        </div>
        
        <div className="bottom-logo">
          <div className="circle-n">N</div>
        </div>
      </div>

      <div className="login-right">
        <nav className="top-nav">
          <a href="#">ABOUT</a>
          <a href="#">DOWNLOAD</a>
          <a href="#">PRICING</a>
          <a href="#">CONTACT</a>
          <a href="#" className="btn-signin">SIGN IN</a>
        </nav>
        
        <div className="right-content">
          <h1 className="welcome-text">Welcome.</h1>
          <p className="welcome-subtext">Empowering your business with intelligent CRM solutions<br/>and automated WhatsApp connectivity.</p>
          <p className="signup-text">Not a member? <a href="#">Sign up now</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
