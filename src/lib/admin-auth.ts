import { getServerSession } from "@/lib/auth";

export async function requireSuperAdmin() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "SUPER_ADMIN") {
    throw new Error("Forbidden");
  }
  return session.user;
}
