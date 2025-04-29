import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Extend the built-in NextAuth types to include our custom properties
declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    organizationId?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      organizationId: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    organizationId: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const firebaseUser = userCredential.user;

          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

          if (!userDoc.exists()) {
            return null;
          }

          const userData = userDoc.data();

          if (!userData.isActive) {
            throw new Error("This account has been deactivated. Please contact support.");
          }

          // Return user data for JWT
          return {
            id: firebaseUser.uid,
            name: userData.fullName,
            email: firebaseUser.email,
            role: userData.role,
            organizationId: userData.organizationId,
            image: firebaseUser.photoURL,
          };
        } catch (error: any) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // For Google auth, we need to create a user in Firestore if it doesn't exist
        if (account.provider === "google") {
          // Logic to handle Google sign-in would go here
          // This would typically involve checking if a user exists in Firestore
          // and creating one if it doesn't
        }

        return {
          ...token,
          id: user.id,
          role: user.role || "user", // Provide default values for required properties
          organizationId: user.organizationId || "",
        };
      }
      
      // Subsequent calls after sign in
      return token;
    },
    async session({ session, token }) {
      // Add custom token data to session
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
  },
}; 