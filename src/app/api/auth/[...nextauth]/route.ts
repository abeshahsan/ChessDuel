import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
};

// Correct handler export for Next.js App Router
const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

export const { GET, POST } = handlers;
