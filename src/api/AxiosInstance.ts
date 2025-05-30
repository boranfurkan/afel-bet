import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AFEL_API_URL,
});

const STORAGE_KEY = "solana-game-auth";

const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.accessToken ?? null;
  } catch {
    return null;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const clientId: string | undefined = process.env.NEXT_PUBLIC_AFEL_CLIENT_ID;
    const clientSecret: string | undefined =
      process.env.NEXT_PUBLIC_AFEL_CLIENT_SECRET;
    const apiKey: string | undefined = process.env.NEXT_PUBLIC_AFEL_API_KEY;

    if (!clientId || !clientSecret || !apiKey) {
      throw new Error("Missing environment variables");
    }

    config.headers.set("x-api-key", apiKey);
    config.headers.set("x-client-id", clientId);
    config.headers.set("x-client-secret", clientSecret);

    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getAxiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  const promise = axiosInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error: Extend the promise object with a cancel method
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
