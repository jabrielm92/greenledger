import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      organizationId: string | null;
      role: string;
      locale: string;
      plan: string;
      emailVerified: boolean;
      trialEndsAt?: string | null;
    };
  }

  interface User extends DefaultUser {
    organizationId?: string | null;
    role?: string;
    locale?: string;
    plan?: string;
    emailVerified?: boolean;
    trialEndsAt?: string | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      organizationId: string | null;
      role: string;
      locale: string;
      plan: string;
      emailVerified: boolean;
      trialEndsAt?: string | null;
    };
  }

  interface User extends DefaultUser {
    organizationId?: string | null;
    role?: string;
    locale?: string;
    plan?: string;
    emailVerified?: boolean;
    trialEndsAt?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    organizationId: string | null;
    role: string;
    locale: string;
    plan: string;
    emailVerified: boolean;
    trialEndsAt?: string | null;
  }
}
