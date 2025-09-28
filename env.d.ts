declare namespace NodeJS {
  interface ProcessEnv {
    PROXYCURL_API_KEY?: string;
    KV_REST_API_URL?: string;
    KV_REST_API_TOKEN?: string;
    AUTH0_SECRET?: string;
    APP_BASE_URL?: string; // local/dev fallback for base URL
    AUTH0_BASE_URL?: string; // required in Vercel/production
    AUTH0_DOMAIN?: string;
    AUTH0_ISSUER_BASE_URL?: string; // https://<AUTH0_DOMAIN>
    AUTH0_CLIENT_ID?: string;
    AUTH0_CLIENT_SECRET?: string;
    NEXT_PUBLIC_LOGIN_ROUTE?: string;
    NEXT_PUBLIC_PROFILE_ROUTE?: string;
    NEXT_PUBLIC_ACCESS_TOKEN_ROUTE?: string;
  }
}
