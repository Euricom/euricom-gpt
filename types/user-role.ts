export const userRoles = ["admin", "user", "HR", "practice manager"] as const

// Create a type from the array
export type UserRole = (typeof userRoles)[number]
