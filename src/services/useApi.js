import { useCallback, useRef } from "react";
import { useAuth as useClerkAuth } from "@clerk/react";
import { apiFetch } from "./apiClient";

export function useApi() {
  const { getToken } = useClerkAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  return useCallback(async (path, options = {}) => {
    const token = await getTokenRef.current();
    return apiFetch(path, { ...options, token });
  }, []);
}