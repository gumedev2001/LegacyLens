import LoginForm from '../../../components/auth/LoginForm';
import styles from '../auth.module.css';

export default function LoginPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <div className={styles.logoCircle}>LL</div>
            <span>LegacyLens</span>
          </div>
          <h1>Iniciar Sesión</h1>
          <p>Bienvenido de vuelta a tu legado familiar</p>
        </div>
        
        <LoginForm />
        
        <div className={styles.authFooter}>
          <p>
            ¿No tienes una cuenta?{' '}
            <a href="/auth/register" className={styles.authLink}>
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}