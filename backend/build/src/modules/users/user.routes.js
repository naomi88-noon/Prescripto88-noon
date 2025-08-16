"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const user_controller_1 = require("./user.controller");
exports.userRouter = (0, express_1.Router)();
// Admin-only: list all users
exports.userRouter.get('/', (0, auth_1.auth)(['ADMIN']), user_controller_1.listUsers);
exports.userRouter.get('/me', (0, auth_1.auth)(), user_controller_1.getMe);
exports.userRouter.patch('/me', (0, auth_1.auth)(), user_controller_1.updateMe);
exports.userRouter.delete('/me', (0, auth_1.auth)(), user_controller_1.deleteMe);
exports.userRouter.get('/:id', (0, auth_1.auth)(['ADMIN']), user_controller_1.getUser);
exports.userRouter.patch('/:id', (0, auth_1.auth)(['ADMIN']), user_controller_1.updateUser);
exports.userRouter.delete('/:id', (0, auth_1.auth)(['ADMIN']), user_controller_1.deleteUser);
