import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Singleton Auth0 client used across server files
export const auth0 = new Auth0Client({
	routes: {
		login: "/api/auth/login",
		logout: "/api/auth/logout",
		callback: "/api/auth/callback",
		backChannelLogout: "/api/auth/backchannel-logout",
	},
});
