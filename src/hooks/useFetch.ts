import { useState, useEffect, DependencyList, useCallback, useRef } from "react";

export const useFetch = <T>(
    fetcher: ((signal: AbortSignal) => Promise<T>) | null,
    deps: DependencyList = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(fetcher !== null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const enabled = fetcher !== null;


  useEffect(() => {
    const currentFetcher = fetcherRef.current;
    if (!currentFetcher) {
        setLoading(false);
        return;
        }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    currentFetcher(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setData(response);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

      return () => controller.abort();
    }, [enabled, reloadKey, ...deps]);
    
  const reload = useCallback(() => {
    setReloadKey((prevKey) => prevKey + 1);
  }, []);

  return { data, loading, error, reload };
};
