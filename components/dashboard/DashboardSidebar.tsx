import { useAuth } from '../../contexts/AuthContext';
import styles from './DashboardSidebar.module.css';

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ 
  activeView, 
  setActiveView, 
  isOpen, 
  onClose 
}: DashboardSidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'legacies', label: 'Mis Legados', icon: '📚' },
    { id: 'create', label: 'Crear Legado', icon: '✨' },
    { id: 'analytics', label: 'Estadísticas', icon: '📊' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={onClose}
        />
      )}
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoCircle}>LL</div>
            <span>LegacyLens</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${
                activeView === item.id ? styles.navItemActive : ''
              }`}
              onClick={() => {
                setActiveView(item.id);
                onClose();
              }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>
                {user?.displayName || 'Usuario'}
              </div>
              <div className={styles.userEmail}>
                {user?.email}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <span className={styles.logoutIcon}>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}