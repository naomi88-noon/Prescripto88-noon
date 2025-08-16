"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genId = genId;
function genId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
