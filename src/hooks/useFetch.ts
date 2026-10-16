import { useState, useEffect, DependencyList, useCallback, useRef } from "react";

const sameDeps = (a: DependencyList, b: DependencyList) =>
  a.length === b.length && a.every((value, index) => Object.is(value, b[index]));

export const useFetch = <T>(
    fetcher: ((signal: AbortSignal) => Promise<T>) | null,
    deps: DependencyList = []
) => {
  const [result, setResult] = useState<{ deps: DependencyList; data: T } | null>(null);
  const [loading, setLoading] = useState(fetcher !== null);
  const [error, setError] = useState<unknown | null>(null);
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

    const requestDeps = deps;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    currentFetcher(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setResult({ deps: requestDeps, data: response });
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

      return () => controller.abort();
    }, [enabled, reloadKey, ...deps]);
    
  const reload = useCallback(() => {
    setReloadKey((prevKey) => prevKey + 1);
  }, []);

  const data = result?.data ?? null;

  return { data, loading, error, reload };
};
