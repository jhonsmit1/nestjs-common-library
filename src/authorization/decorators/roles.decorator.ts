import { SetMetadata } from "@nestjs/common";
import {
  ROLES_KEY,
  PERMISSIONS_KEY,
} from "../constants/authorization.constants";

/**
 * Generic Roles decorator.
 * The project using this library defines the actual Role type.
 */
export const Roles = <T = string>(...roles: T[]) =>
  SetMetadata(ROLES_KEY, roles);

/**
 * Generic Permissions decorator.
 * The project using this library defines the actual Permission type.
 */
export const RequirePermission = <T = string>(...permissions: T[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
