import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import styles from '../styles/__root.module.css';

const RootLayout = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <h1 className={styles.title}>{import.meta.env.VITE_TITLE ?? t('common.appTitle')}</h1>
        </Link>
        <div className={styles.languageSwitcherWrapper}>
          <LanguageSwitcher />
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({ component: RootLayout });
