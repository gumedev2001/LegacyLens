'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const { user } = useAuth();

  const isAuthPage = pathname?.startsWith('/auth');
  const isDashboardPage = pathname?.startsWith('/dashboard');

  // Efecto para detectar scroll (solo en página principal)
  useEffect(() => {
    if (isAuthPage || isDashboardPage) return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      
      // Detectar sección activa solo si estamos en la página principal
      const sections = ['inicio', 'como-funciona', 'biblioteca', 'chatbot-demo'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthPage, isDashboardPage]);

  const scrollToSection = (sectionId: string) => {
    if (isAuthPage || isDashboardPage) {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    if (isAuthPage || isDashboardPage) {
      window.location.href = '/';
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'como-funciona', label: 'Cómo Funciona' },
    { id: 'biblioteca', label: 'Biblioteca' },
    { id: 'chatbot-demo', label: 'Demo AI' }
  ];

  // Header para páginas de auth
  if (isAuthPage) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoCircle}>LL</div>
            <span>LegacyLens</span>
          </Link>
          
          <div className={styles.mobileOnly}>
            <Link href="/" className={styles.backButton}>
              ← Volver
            </Link>
          </div>
          
          <div className={styles.desktopOnly}>
            <Link href="/" className={styles.navLink}>
              ← Volver al Inicio
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Header para dashboard
  if (isDashboardPage) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoCircle}>LL</div>
            <span>LegacyLens</span>
          </Link>
          
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              ← Volver al Sitio
            </Link>
            
            <div className={styles.authSection}>
              <Link href="/dashboard" className={styles.ctaButton}>
                Mi Dashboard
              </Link>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  // Header normal para página principal
  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={scrollToTop}>
          <div className={styles.logoCircle}>LL</div>
          <span>LegacyLens</span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`${styles.navLink} ${
                activeSection === item.id ? styles.activeSection : ''
              }`}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          
          <div className={styles.authSection}>
            {user ? (
              <Link href="/dashboard" className={styles.ctaButton}>
                Mi Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className={styles.loginButton}>
                  Iniciar Sesión
                </Link>
                <Link href="/auth/register" className={styles.ctaButton}>
                  Comenzar tu Legado
                </Link>
              </>
            )}
          </div>
        </nav>

        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {isMobileMenuOpen && (
          <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={styles.mobileNavLink}
                onClick={() => scrollToSection(item.id)}>
                {item.label}
              </button>
            ))}
            
            <div className={styles.mobileAuthSection}>
              {user ? (
                <Link href="/dashboard" className={styles.ctaButton}>
                  Mi Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className={styles.mobileNavLink}>
                    Iniciar Sesión
                  </Link>
                  <Link href="/auth/register" className={styles.ctaButton}>
                    Comenzar tu Legado
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}