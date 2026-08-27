import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop — remet la page en haut à chaque changement de route.
 * À placer une seule fois dans CorporateLayout (et tout autre layout racine).
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
