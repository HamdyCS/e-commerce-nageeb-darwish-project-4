//1995 => admin
//2001 => Writer
//1991 => user
export type Role = "2001" | "1995" | "1991";

export function getRoleNameByRoleNumber(role: "2001" | "1995" | "1991") {
  switch (role) {
    case "2001":
      return "Writer";
    case "1995":
      return "Admin";
    case "1991":
      return "User";
    default:
      return "Unknown";
  }
}

export enum enRole {
  "admin" = "1995",
  "writer" = "2001",
  "user" = "1991",
}

export function isEnRole(value: unknown): value is enRole {
  return Object.values(enRole).includes(value as enRole);
}
