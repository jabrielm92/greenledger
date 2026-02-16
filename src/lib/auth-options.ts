import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { organization: true },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          organizationId: user.organizationId,
          role: user.role,
          plan: user.organization?.plan ?? "FREE_TRIAL",
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.organizationId = (user as Record<string, unknown>).organizationId as string | null;
        token.role = (user as Record<string, unknown>).role as string;
        token.plan = (user as Record<string, unknown>).plan as string;
      }

      // Allow session updates (e.g., after onboarding completes)
      if (trigger === "update" && session) {
        if (session.organizationId) token.organizationId = session.organizationId;
        if (session.role) token.role = session.role;
        if (session.plan) token.plan = session.plan;
      }

      // Refresh org data on each request if user has an org
      if (token.id && !token.organizationId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { organization: true },
        });
        if (dbUser?.organizationId) {
          token.organizationId = dbUser.organizationId;
          token.role = dbUser.role;
          token.plan = dbUser.organization?.plan ?? "FREE_TRIAL";
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
      }
      return session;
    },
  },
};
