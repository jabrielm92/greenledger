import { auth } from "@/lib/auth-options";

export async function getServerSession() {
  return auth();
}

export async function getCurrentUser() {
  const session = await getServerSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function requireOrganization() {
  const user = await requireAuth();
  if (!user.organizationId) {
    throw new Error("No organization");
  }
  return user as typeof user & { organizationId: string };
}
