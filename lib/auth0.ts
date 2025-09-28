import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Ensure required env vars exist, with sensible fallbacks for local/dev
if (!process.env.AUTH0_BASE_URL && process.env.APP_BASE_URL) {
	process.env.AUTH0_BASE_URL = process.env.APP_BASE_URL;
}
// Older SDK option name is `domain` (not issuerBaseURL) – keep domain in env

// Singleton Auth0 client used across server files
export const auth0 = new Auth0Client({
	// Explicitly pass options so the SDK doesn't rely on missing env vars at runtime
	domain: process.env.AUTH0_DOMAIN!,
	clientId: process.env.AUTH0_CLIENT_ID!,
	clientSecret: process.env.AUTH0_CLIENT_SECRET!,
	secret: process.env.AUTH0_SECRET!,
	appBaseUrl: (process.env.AUTH0_BASE_URL || process.env.APP_BASE_URL || "").replace(/\/$/, ""),
	routes: {
		login: "/api/auth/login",
		logout: "/api/auth/logout",
		callback: "/api/auth/callback",
		backChannelLogout: "/api/auth/backchannel-logout",
	},
});
