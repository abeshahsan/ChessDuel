import NextAuth, { NextAuthConfig, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import DiscordProvider from "next-auth/providers/discord";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		provider?: string;
		user: {
			id: string;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		provider?: string;
		id?: string;
	}
}

export const authOptions: NextAuthConfig = {
	providers: [
		// Only include providers if credentials are available
		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			})
		] : []),
		...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
			FacebookProvider({
				clientId: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			})
		] : []),
		...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET ? [
			DiscordProvider({
				clientId: process.env.DISCORD_CLIENT_ID,
				clientSecret: process.env.DISCORD_CLIENT_SECRET,
			})
		] : []),
	],
	pages: {
		signIn: "/auth/sign-in",
		error: "/auth/error",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			// Persist the OAuth access_token and user id to the token right after signin
			if (account) {
				token.accessToken = account.access_token;
				token.provider = account.provider;
			}
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			// Send properties to the client
			if (token) {
				session.user.id = token.id as string;
				session.accessToken = token.accessToken as string;
				session.provider = token.provider as string;
			}
			return session;
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin or whitelisted domains
			try {
				if (new URL(url).origin === baseUrl) return url;
			} catch {
				// Invalid URL, return baseUrl
			}
			return baseUrl;
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
