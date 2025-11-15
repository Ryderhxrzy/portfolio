import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';
import './styles/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const onRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const showAlert = (type, title, text) => {
    const themeColors = {
      success: {
        background: 'var(--surface)',
        confirmButtonColor: 'var(--accent)'
      },
      error: {
        background: 'var(--surface)',
        confirmButtonColor: 'var(--accent-hover)'
      },
      warning: {
        background: 'var(--surface)',
        confirmButtonColor: 'var(--secondary-accent)'
      }
    };

    return Swal.fire({
      title,
      text,
      icon: type,
      background: themeColors[type]?.background || 'var(--surface)',
      color: 'var(--text)',
      confirmButtonColor: themeColors[type]?.confirmButtonColor || 'var(--accent)',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
        confirmButton: 'custom-swal-confirm'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if reCAPTCHA is configured
    if (!import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      setLoading(false);
      showAlert('error', 'Configuration Error', 'reCAPTCHA is not properly configured. Please contact the administrator.');
      return;
    }

    // reCAPTCHA validation
    if (!recaptchaToken) {
      setLoading(false);
      showAlert('warning', 'Verification Required', 'Please complete the reCAPTCHA verification before logging in.');
      return;
    }

    // Email validation
    if (!credentials.email) {
      setLoading(false);
      showAlert('warning', 'Email Required', 'Please enter your email address.');
      return;
    }

    if (!validateEmail(credentials.email)) {
      setLoading(false);
      showAlert('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    // Password validation
    if (!credentials.password) {
      setLoading(false);
      showAlert('warning', 'Password Required', 'Please enter your password.');
      return;
    }

    if (credentials.password.length < 6) {
      setLoading(false);
      showAlert('error', 'Password Too Short', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes - in real app, this would be an API call
      if (credentials.email && credentials.password) {
        showAlert('success', 'Login Successful!', `Welcome back, ${credentials.email.split('@')[0]}!`);
        // Reset reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setRecaptchaToken(null);
        // Handle successful login - redirect or update app state
      } else {
        showAlert('error', 'Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      showAlert('error', 'Connection Error', 'Unable to connect to server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email address"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="form-input password-input"
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="form-group recaptcha-group">
            {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={onRecaptchaChange}
                onExpired={onRecaptchaExpired}
                theme={document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'}
                size="compact"
              />
            ) : (
              <div className="recaptcha-error">
                <i className="fas fa-exclamation-triangle"></i>
                reCAPTCHA configuration missing. Please check environment variables.
              </div>
            )}
            {!recaptchaToken && !loading && (
              <div className="recaptcha-error">
                <i className="fas fa-exclamation-triangle"></i>
                Please complete the reCAPTCHA verification
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading || !recaptchaToken || !import.meta.env.VITE_RECAPTCHA_SITE_KEY}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 Jhayr Cervantes - Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
