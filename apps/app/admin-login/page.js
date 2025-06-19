'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend authentication disabled
      /*
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.admin));

        // Redirect to admin dashboard
        router.push('/admin-dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
      */

      // Mock login for UI demo
      if (formData.email && formData.password) {
        // Mock successful login
        localStorage.setItem('adminToken', 'demo-token');
        localStorage.setItem('adminUser', JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          email: formData.email
        }));

        // Redirect to admin dashboard
        router.push('/admin-dashboard');
      } else {
        setError('Please enter email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Baltar Inc</h1>
          <p className={styles.subtitle}>Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2 className={styles.title}>Admin Login</h2>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your admin email"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingSpinner}></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}
