"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermission = exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const authorization_constants_1 = require("../constants/authorization.constants");
const Roles = (...roles) => (0, common_1.SetMetadata)(authorization_constants_1.ROLES_KEY, roles);
exports.Roles = Roles;
const RequirePermission = (...permissions) => (0, common_1.SetMetadata)(authorization_constants_1.PERMISSIONS_KEY, permissions);
exports.RequirePermission = RequirePermission;
//# sourceMappingURL=roles.decorator.js.map