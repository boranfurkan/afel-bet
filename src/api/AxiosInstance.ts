import axios, { AxiosRequestConfig } from "axios";

const STORAGE_KEY = "solana-game-auth";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  tokenType: string;
  walletAddress: string;
}

const getStoredAuth = (): AuthData | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storeAuth = (data: AuthData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const isExpired = (isoDateString: string): boolean => {
  return new Date(isoDateString).getTime() <= Date.now();
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<AuthData | null> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AFEL_API_URL}games/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_AFEL_API_KEY!,
          "x-client-id": process.env.NEXT_PUBLIC_AFEL_CLIENT_ID!,
          "x-client-secret": process.env.NEXT_PUBLIC_AFEL_CLIENT_SECRET!,
        },
      }
    );
    const newAuth = response.data as AuthData;
    storeAuth(newAuth);
    return newAuth;
  } catch (error) {
    console.error("Token refresh failed", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AFEL_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const clientId = process.env.NEXT_PUBLIC_AFEL_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_AFEL_CLIENT_SECRET;
    const apiKey = process.env.NEXT_PUBLIC_AFEL_API_KEY;

    if (!clientId || !clientSecret || !apiKey) {
      throw new Error("Missing environment variables");
    }

    config.headers.set("x-api-key", apiKey);
    config.headers.set("x-client-id", clientId);
    config.headers.set("x-client-secret", clientSecret);

    let auth = getStoredAuth();

    if (auth) {
      if (isExpired(auth.accessTokenExpiresAt)) {
        if (!isExpired(auth.refreshTokenExpiresAt)) {
          auth = await refreshAccessToken(auth.refreshToken);
        } else {
          // Both tokens expired
          localStorage.removeItem(STORAGE_KEY);
          auth = null;
        }
      }
    }

    if (auth?.accessToken) {
      config.headers.set("Authorization", `Bearer ${auth.accessToken}`);
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

  // @ts-expect-error
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};
