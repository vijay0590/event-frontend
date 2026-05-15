import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scrolls the window to the top-left corner
    window.scrollTo(0, 0);
  }, [pathname]); // Fires every time the URL path changes

  return null; // This component doesn't render anything UI-wise
};

export default ScrollToTop;