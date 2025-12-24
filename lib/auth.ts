// lib/auth.ts
export function assertAdmin(userRole?: string) {
  if (userRole !== "admin") {
    throw new Error("Unauthorized: Admin access only");
  }
}
