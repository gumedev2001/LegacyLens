import RegisterForm from '../../../components/auth/RegisterForm';
import styles from '../auth.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <div className={styles.logoCircle}>LL</div>
            <span>LegacyLens</span>
          </div>
          <h1>Crear Cuenta</h1>
          <p>Comienza a preservar tu legado familiar</p>
        </div>
        
        <RegisterForm />
        
        <div className={styles.authFooter}>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <a href="/auth/login" className={styles.authLink}>
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}