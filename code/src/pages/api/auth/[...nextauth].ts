import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const nextAuthOptions: NextAuthOptions = {
  callbacks: {
    signIn: ({ profile }) => {
      return profile.sub === process.env.GOOGLE_ACCOUNT_ID;
    },
  },
  pages: {
    signIn: '/auth',
    // signOut: '/auth',
    // error: '/auth',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.SESSION_SECRET,
};

export default NextAuth(nextAuthOptions);
