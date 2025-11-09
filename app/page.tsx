import Chatbot from '../components/chatbot/Chatbot'
import HowItWorks from '../components/how-it-works/HowItWorks'
import LegacyLibrary from '../components/legacy-library/LegacyLibrary'
import styles from './home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.hero} id="inicio">
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Preserva las historias<br />de tu familia
            </h1>
            <p className={styles.subtitle}>
              Convierte los recuerdos en un legado eterno con nuestra plataforma interactiva 
              que combina inteligencia artificial con la sabiduría de generaciones.
            </p>
            <div className={styles.buttonContainer}>
              <button className={styles.primaryButton}>
                Comenzar tu Legado
              </button>
              <button className={styles.secondaryButton}>
                Ver Demo
              </button>
            </div>
          </div>
        </section>

        {/* Cómo Funciona Section */}
        <HowItWorks />

        {/* Biblioteca de Legados Section */}
        <LegacyLibrary />

        {/* Chatbot Demo Section */}
        <Chatbot />
      </main>
    </div>
  )
}