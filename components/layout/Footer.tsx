import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Columna 1: Logo y descripción */}
          <div>
            <div className={styles.logoContainer}>
              <div className={styles.logoCircle}>LL</div>
              <span className={styles.logoText}>LegacyLens</span>
            </div>
            <p className={styles.description}>
              Convierte los recuerdos en un legado eterno. Preserva las historias de tu familia 
              para las generaciones futuras con nuestra plataforma interactiva de preservación digital.
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className={styles.newsletter}>
            <h3>Suscríbete a nuestro newsletter</h3>
            <p>Recibe tips exclusivos para preservar tus historias familiares y actualizaciones de nuevas funciones.</p>
            <div className={styles.form}>
              <input 
                type="email" 
                placeholder="tu@email.com"
                className={styles.input}
              />
              <button className={styles.subscribeButton}>
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} LegacyLens. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}