"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_js_1 = require("./controller.js");
const middleware_js_1 = require("./middleware.js");
const multer_js_1 = __importDefault(require("./multer.js"));
const adminRouter = (0, express_1.Router)();
adminRouter.post("/album/new", middleware_js_1.isAuth, multer_js_1.default.single("thumbnail"), controller_js_1.addAlbum);
adminRouter.post("/song/new", middleware_js_1.isAuth, multer_js_1.default.single("audio"), controller_js_1.addSong);
adminRouter.patch("/song/:id/thumbnail", middleware_js_1.isAuth, multer_js_1.default.single("thumbnail"), controller_js_1.addThumbnail);
adminRouter.delete("/album/:id", middleware_js_1.isAuth, controller_js_1.deleteAlbum);
exports.default = adminRouter;
