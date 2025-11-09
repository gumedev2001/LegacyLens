import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: '💬',
      title: 'Conversa con nuestro AI',
      description: 'Nuestro entrevistador AI te hace preguntas inteligentes y personalizadas que evocan recuerdos profundos y significativos.'
    },
    {
      number: '2',
      icon: '📸',
      title: 'Agrega fotos y medios',
      description: 'Sube fotos antiguas, graba audio o video. Cada medio se convierte en parte de tu línea de tiempo interactiva.'
    },
    {
      number: '3',
      icon: '📖',
      title: 'Recibe tu legado digital',
      description: 'Genera un libro familiar hermoso o comparte tu legado digital de forma segura con las generaciones futuras.'
    }
  ];

  const features = [
    {
      title: 'Entrevistador AI Inteligente',
      description: 'No solo hace preguntas genéricas. Aprende de tus respuestas y profundiza en lo que realmente importa.'
    },
    {
      title: 'Línea de Tiempo Interactiva',
      description: 'Visualiza la historia de tu familia en una línea de tiempo que combina eventos personales con hitos históricos.'
    },
    {
      title: 'Plantillas Profesionales',
      description: 'Elige entre múltiples diseños para tu libro familiar, desde clásico y elegante hasta moderno y minimalista.'
    },
    {
      title: 'Compartición Segura',
      description: 'Controla quién puede ver cada historia. Comparte selectivamente con familiares cercanos o genera enlaces privados.'
    }
  ];

  return (
    <section className={styles.howItWorks} id="como-funciona">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Preserva historias en 3 simples pasos</h2>
          <p className={styles.subtitle}>
            Desde la conversación inicial hasta tu legado familiar preservado para siempre
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepIcon}>{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>¿Listo para comenzar tu legado?</h3>
          <p className={styles.ctaSubtitle}>
            Únete a miles de familias que ya están preservando sus historias para las futuras generaciones
          </p>
          <button className={styles.ctaButton}>
            Comenzar Gratis
          </button>
        </div>
      </div>
    </section>
    
  );

  
}
