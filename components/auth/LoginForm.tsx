'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './AuthForms.module.css';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      setError('');
      
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      
      router.push('/');
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'El email no es válido';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde';
      default:
        return 'Error al iniciar sesión. Intenta nuevamente';
    }
  };

  return (
    <div className={styles.formContainer}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="tu@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Tu contraseña"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.options}>
          <label className={styles.remember}>
            <input type="checkbox" disabled={isLoading} />
            <span>Recordarme</span>
          </label>
          <a href="/auth/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className={styles.divider}>
        <span>o continúa con</span>
      </div>

      <div className={styles.socialButtons}>
        <button 
          type="button"
          className={styles.socialButton}
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <span className={styles.socialIcon}>🔍</span>
          Google
        </button>
        
        <button 
          type="button"
          className={styles.socialButton}
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
        >
          <span className={styles.socialIcon}>👤</span>
          Facebook
        </button>
      </div>
    </div>
  );
}