"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getBanksFromApi,
  getCardsFromApi,
  getCategoriesFromApi,
  getMerchantsFromApi,
  getMerchantByIdFromApi,
  getRecommendationsFromApi,
  getPromotionsForMerchantFromApi,
  type ApiBank,
  type ApiCard,
  type ApiCategory,
  type ApiMerchant,
  type ApiRecommendation,
  type ApiPromotion,
} from "@/lib/api-client";

// ──────────────────────────────────────────────────────────────
// Generic result shape
// ──────────────────────────────────────────────────────────────

interface ApiState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ──────────────────────────────────────────────────────────────
// useBanks — load all banks once
// ──────────────────────────────────────────────────────────────

export function useBanks(): ApiState<ApiBank[]> {
  const [state, setState] = useState<{ data: ApiBank[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    getBanksFromApi()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: [], loading: false, error: err.message });
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  return { ...state, refetch };
}

// ──────────────────────────────────────────────────────────────
// useCards — load all cards once
// ──────────────────────────────────────────────────────────────

export function useCards(): ApiState<ApiCard[]> {
  const [state, setState] = useState<{ data: ApiCard[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    getCardsFromApi()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: [], loading: false, error: err.message });
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  return { ...state, refetch };
}

// ──────────────────────────────────────────────────────────────
// useCategories — load all merchant categories once
// ──────────────────────────────────────────────────────────────

export function useCategories(): ApiState<ApiCategory[]> {
  const [state, setState] = useState<{ data: ApiCategory[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    getCategoriesFromApi()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: [], loading: false, error: err.message });
      });
    return () => { cancelled = true; };
  }, [reloadKey]);

  return { ...state, refetch };
}

// ──────────────────────────────────────────────────────────────
// useMerchants — search merchants with debounce
// ──────────────────────────────────────────────────────────────

export function useMerchants(
  query: string,
  category: string | null,
): ApiState<ApiMerchant[]> {
  const [state, setState] = useState<{ data: ApiMerchant[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    const timer = setTimeout(() => {
      getMerchantsFromApi({
        q: query || undefined,
        category: category || undefined,
      })
        .then((data) => {
          if (!cancelled) setState({ data, loading: false, error: null });
        })
        .catch((err) => {
          if (!cancelled) setState({ data: [], loading: false, error: err.message });
        });
    }, query ? 200 : 0); // debounce only on text input

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, category, reloadKey]);

  return { ...state, refetch };
}

// ──────────────────────────────────────────────────────────────
// useRecommendations — fetch recommendations for given cards/date
// ──────────────────────────────────────────────────────────────

export function useRecommendations(
  cardIds: string[],
  date: Date,
  merchantId?: string,
): ApiState<ApiRecommendation[]> {
  const [state, setState] = useState<{ data: ApiRecommendation[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  // Stabilize cardIds array reference for the effect dependency
  const cardIdsKey = cardIds.join(",");
  const dateKey = date.toISOString().split("T")[0];

  useEffect(() => {
    if (cardIds.length === 0) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    getRecommendationsFromApi({ cardIds, date, merchantId })
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: [], loading: false, error: err.message });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardIdsKey, dateKey, merchantId, reloadKey]);

  return { ...state, refetch };
}

// ──────────────────────────────────────────────────────────────
// usePromotions — fetch all promotions for a merchant
// ──────────────────────────────────────────────────────────────

export function usePromotions(merchantId: string): ApiState<ApiPromotion[]> {
  const [state, setState] = useState<{ data: ApiPromotion[]; loading: boolean; error: string | null }>({
    data: [],
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    getPromotionsForMerchantFromApi(merchantId)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: [], loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [merchantId, reloadKey]);

  return { ...state, refetch };
}

// ──────────────────────────────────────────────────────────────
// useMerchantFromApi — fetch a single merchant by exact ID
// ──────────────────────────────────────────────────────────────

export function useMerchantFromApi(merchantId: string): ApiState<ApiMerchant | null> {
  const [state, setState] = useState<{ data: ApiMerchant | null; loading: boolean; error: string | null }>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    getMerchantByIdFromApi(merchantId)
      .then((merchant) => {
        if (!cancelled) setState({ data: merchant, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [merchantId, reloadKey]);

  return { ...state, refetch };
}
