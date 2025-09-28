declare namespace NodeJS {
  interface ProcessEnv {
    PROXYCURL_API_KEY?: string;
    KV_REST_API_URL?: string;
    KV_REST_API_TOKEN?: string;
    AUTH0_SECRET?: string;
    APP_BASE_URL?: string; // used by SDK for base URL
    AUTH0_DOMAIN?: string;
    AUTH0_CLIENT_ID?: string;
    AUTH0_CLIENT_SECRET?: string;
    NEXT_PUBLIC_LOGIN_ROUTE?: string;
    NEXT_PUBLIC_PROFILE_ROUTE?: string;
    NEXT_PUBLIC_ACCESS_TOKEN_ROUTE?: string;
  }
}
