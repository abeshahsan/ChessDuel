import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({ providers: [GitHub] });

export type user = {
	id: string | undefined | null;
	name: string | undefined | null;
	email: string | undefined | null;
	image: string | undefined | null;
};
