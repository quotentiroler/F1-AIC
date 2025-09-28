import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Ensure required env vars exist, with sensible fallbacks for local/dev
if (!process.env.AUTH0_BASE_URL && process.env.APP_BASE_URL) {
	process.env.AUTH0_BASE_URL = process.env.APP_BASE_URL;
}
if (!process.env.AUTH0_ISSUER_BASE_URL && process.env.AUTH0_DOMAIN) {
	process.env.AUTH0_ISSUER_BASE_URL = `https://${process.env.AUTH0_DOMAIN}`;
}

// Singleton Auth0 client used across server files
export const auth0 = new Auth0Client({
	routes: {
		login: "/api/auth/login",
		logout: "/api/auth/logout",
		callback: "/api/auth/callback",
		backChannelLogout: "/api/auth/backchannel-logout",
	},
});
