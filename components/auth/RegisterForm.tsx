'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './AuthForms.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(formData.name, formData.email, formData.password);
      // Mostrar mensaje de verificación de email
      alert('¡Cuenta creada! Por favor verifica tu email antes de iniciar sesión.');
      router.push('/auth/login');
    } catch (error: any) {
      setError(getErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
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
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este email';
      case 'auth/invalid-email':
        return 'El email no es válido';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil';
      case 'auth/operation-not-allowed':
        return 'Esta operación no está permitida';
      default:
        return 'Error al crear la cuenta. Intenta nuevamente';
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
          <label htmlFor="name" className={styles.label}>
            Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="Tu nombre completo"
            required
            disabled={isLoading}
          />
        </div>

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
            placeholder="Crea una contraseña segura"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Repite tu contraseña"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.terms}>
          <label className={styles.remember}>
            <input type="checkbox" required disabled={isLoading} />
            <span>
              Acepto los{' '}
              <a href="/terms" className={styles.inlineLink}>
                Términos de Servicio
              </a>{' '}
              y la{' '}
              <a href="/privacy" className={styles.inlineLink}>
                Política de Privacidad
              </a>
            </span>
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className={styles.divider}>
        <span>o regístrate con</span>
      </div>

      <div className={styles.socialButtons}>
        <button 
          type="button"
          className={styles.socialButton}
          onClick={() => handleSocialRegister('google')}
          disabled={isLoading}
        >
          <span className={styles.socialIcon}>🔍</span>
          Google
        </button>
        
        <button 
          type="button"
          className={styles.socialButton}
          onClick={() => handleSocialRegister('facebook')}
          disabled={isLoading}
        >
          <span className={styles.socialIcon}>👤</span>
          Facebook
        </button>
      </div>
    </div>
  );
}