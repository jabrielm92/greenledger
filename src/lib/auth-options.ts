import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

const result = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
    error: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;

          if (!email || !password) {
            console.error("[AUTH] Missing email or password");
            return null;
          }

          const parsed = loginSchema.safeParse({ email, password });
          if (!parsed.success) {
            console.error("[AUTH] Validation failed:", parsed.error.flatten());
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email.toLowerCase() },
            include: { organization: true },
          });

          if (!user || !user.hashedPassword) {
            console.error("[AUTH] User not found or no password:", parsed.data.email);
            return null;
          }

          const isValid = await bcrypt.compare(parsed.data.password, user.hashedPassword);
          if (!isValid) {
            console.error("[AUTH] Invalid password for:", parsed.data.email);
            return null;
          }

          console.log("[AUTH] Authorize success for:", user.email, "id:", user.id);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            organizationId: user.organizationId,
            role: user.role,
            plan: user.organization?.plan ?? "FREE_TRIAL",
            emailVerified: !!user.emailVerified,
          };
        } catch (error) {
          console.error("[AUTH] Authorize error:", error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Explicitly allow credentials sign-in (adapter won't interfere)
      if (account?.provider === "credentials") {
        return !!user;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.organizationId = (user as Record<string, unknown>).organizationId as string | null;
        token.role = (user as Record<string, unknown>).role as string;
        token.plan = (user as Record<string, unknown>).plan as string;
        token.emailVerified = !!(user as Record<string, unknown>).emailVerified;
      }

      // Allow session updates (e.g., after onboarding completes or email verified)
      if (trigger === "update" && session) {
        if (session.organizationId) token.organizationId = session.organizationId;
        if (session.role) token.role = session.role;
        if (session.plan) token.plan = session.plan;
        if (session.emailVerified !== undefined) token.emailVerified = session.emailVerified;
      }

      // Refresh user data from DB on each request if missing org or not yet verified
      if (token.id && (!token.organizationId || !token.emailVerified)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: { organization: true },
          });
          if (dbUser) {
            if (dbUser.organizationId) {
              token.organizationId = dbUser.organizationId;
              token.role = dbUser.role;
              token.plan = dbUser.organization?.plan ?? "FREE_TRIAL";
            }
            token.emailVerified = !!dbUser.emailVerified;
          }
        } catch (error) {
          console.error("[AUTH] JWT refresh error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.organizationId = token.organizationId as string | null;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    },
  },
});

export const { handlers, auth, signIn, signOut } = result;
export const authOptions = result;
