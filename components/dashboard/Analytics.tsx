import styles from './DashboardSections.module.css';

export default function Analytics() {
  const stats = [
    { label: 'Legados Totales', value: '2', icon: '📚' },
    { label: 'Historias Creadas', value: '7', icon: '📖' },
    { label: 'Fotos Subidas', value: '15', icon: '📸' },
    { label: 'Familiares Involucrados', value: '3', icon: '👨‍👩‍👧‍👦' }
  ];

  const recentActivity = [
    { action: 'Creaste el legado "Historia de mi Abuelo"', date: 'Hace 2 días' },
    { action: 'Agregaste 3 fotos a "Nuestra Boda Familiar"', date: 'Hace 5 días' },
    { action: 'Completaste la historia "Primer Trabajo"', date: 'Hace 1 semana' }
  ];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Estadísticas</h2>
        <p>Mira el progreso de tu trabajo en LegacyLens</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.activitySection}>
        <h3>Actividad Reciente</h3>
        <div className={styles.activityList}>
          {recentActivity.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={styles.activityAction}>{activity.action}</div>
              <div className={styles.activityDate}>{activity.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tipsSection}>
        <h3>💡 Tips para Continuar</h3>
        <ul className={styles.tipsList}>
          <li>Invita a familiares a colaborar en tus legados</li>
          <li>Sube fotos antiguas y escanéalas para mejor calidad</li>
          <li>Usa nuestro entrevistador AI para descubrir nuevas historias</li>
          <li>Programa recordatorios para completar legados pendientes</li>
        </ul>
      </div>
    </div>
  );
}