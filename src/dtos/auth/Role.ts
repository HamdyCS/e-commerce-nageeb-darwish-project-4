//1995 => admin
//1991 => writer
//2001 => user
//1999 => productManager
export type Role = "2001" | "1995" | "1991" | "1999";

export function getRoleNameByRoleNumber(
  role: "2001" | "1995" | "1991" | "1999",
) {
  switch (role) {
    case "2001":
      return "User";
    case "1995":
      return "Admin";
    case "1991":
      return "Writer";
    case "1999":
      return "Product Manager";
    default:
      return "Unknown";
  }
}

export enum enRole {
  "admin" = "1995",
  "writer" = "1991",
  "user" = "2001",
  "productManager" = "1999",
}

export function isEnRole(value: unknown): value is enRole {
  return Object.values(enRole).includes(value as enRole);
}
