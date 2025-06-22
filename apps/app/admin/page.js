'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(getApiEndpoint('/api/auth/login'), {
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
        router.push('/admin/dashboard');
      } else {
        setError(result.error || 'Login failed');
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
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>Baltar Inc</span>
          </div>
          <p className={styles.subtitle}>Admin Portal</p>
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
              placeholder="admin@admin.com"
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
              'Sign In'
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
