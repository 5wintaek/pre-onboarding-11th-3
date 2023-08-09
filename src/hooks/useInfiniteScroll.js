import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (target) => {
  const [intersecting, setIntersecting] = useState(false);
  const observerRef = useRef(null);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, []);

  useEffect(() => {
    const observer = getObserver();

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [getObserver, target]);

  return intersecting;
};

export default useInfiniteScroll;
