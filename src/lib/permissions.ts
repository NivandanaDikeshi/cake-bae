import { useAppState } from "@/context/StateContext";

export type PermissionModule =
  | "dashboard"
  | "products"
  | "orders"
  | "users"
  | "calendar"
  | "messages"
  | "roles";

export type PermissionAction = "create" | "read" | "update" | "delete" | "export";

/**
 * Pure helper — checks a permissions map directly.
 * Use this if you already have the role's permissions object in hand.
 */
export function hasPermission(
  permissions: Record<string, string[]> | undefined | null,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  if (!permissions) return false;
  return permissions[module]?.includes(action) ?? false;
}

export function useHasPermission(module: PermissionModule, action: PermissionAction): boolean {
  const { currentUser, roles } = useAppState() as any;

  if (!currentUser) return false;

  // ADJUST THIS: however your app links a user to their Role.
  // Option A — currentUser already carries the full role object:
  const role =
    currentUser.role ??
    // Option B — currentUser only carries a roleId, so look it up:
    roles?.find((r: any) => r.id === currentUser.roleId);

  if (!role) return false;

  if (role.isAdminPrivileges) return true;

  return hasPermission(role.permissions, module, action);
}