import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import styles from '../styles/__root.module.css';

const RootLayout = () => (
  <div className={styles.container}>
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <h1 className={styles.title}>{import.meta.env.VITE_TITLE ?? 'Quizy!'}</h1>
      </Link>
    </header>
    <main className={styles.main}>
      <Outlet />
    </main>
    <TanStackRouterDevtools />
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
