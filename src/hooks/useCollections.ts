import { useCollectionsContext } from "@/contexts/CollectionsProvider";
import { Pagination } from "@/types/nft";
import { useCallback, useEffect, useState, useRef } from "react";
import { getNftCollections } from "../services/api";

export const useCollections = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [totalCount, setTotalCount] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { selectedTraits, selectedOptionSort } = useCollectionsContext();
  const [error, setError] = useState<string | null>(null);

  // İlk yüklemede iki kere çağırılmasını engellemek için
  const isFirstLoad = useRef(true);

  // Koleksiyonları çekme fonksiyonu
  const fetchCollections = useCallback(
    async (newPage: number, size: number, reset: boolean = false) => {
      if (loading) return; // Zaten yükleniyorsa tekrar çalıştırma

      setLoading(true);
      const paginationParam: Pagination = { page: newPage, size: size };

      try {
        const data = await getNftCollections(
          paginationParam,
          selectedTraits,
          selectedOptionSort
        );

        if (Array.isArray(data.items)) {
          setCollections((prev) =>
            reset ? data.items : [...prev, ...data.items]
          );
          setTotalCount(data?.meta?.totalItems);
          setHasMore(data?.meta?.hasNextPage ?? data.items.length === 20);
        } else {
          console.error("Expected an array but got:", data.items);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Error fetching collections");
      } finally {
        setLoading(false);
      }
    },
    [selectedTraits, selectedOptionSort, loading]
  );

  // Sayfa değiştiğinde yeni veriyi getir (Infinite Scroll)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    fetchCollections(page, size);
  }, [page, size]);

  // Filtre veya sıralama değiştiğinde:
  useEffect(() => {
    window.scrollTo(0, 0);

    setTimeout(() => {
      setPage(1);
      setCollections([]);
      setHasMore(true);
      fetchCollections(page, size, true);
    }, 500); // Sayfanın en üstüne scroll yap
  }, [selectedTraits, selectedOptionSort]);

  return {
    hasMore,
    collections,
    totalCount,
    setPage,
    setSize,
    loading,
    error,
  };
};
