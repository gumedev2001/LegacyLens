import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  user: any;
  onMenuToggle: () => void;
}

export default function DashboardHeader({ user, onMenuToggle }: DashboardHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <button 
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <div className={styles.greeting}>
            <h1>{getGreeting()}, {user?.displayName?.split(' ')[0] || 'Usuario'}!</h1>
            <p>Bienvenido a tu panel de LegacyLens</p>
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.userBadge}>
            <div className={styles.userInitial}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.displayName || 'Usuario'}
              </span>
              <span className={styles.userStatus}>En línea</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}