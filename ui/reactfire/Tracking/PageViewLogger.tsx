import { useAnalytics } from 'reactfire';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';

const PageViewLogger = () => {
  const analytics = useAnalytics();
  const { pathname } = useLocation();

  useEffect(() => {
    logEvent(analytics, 'page-view', { page_path: pathname });
  }, [analytics, pathname]);

  return null;
};

export default PageViewLogger;
