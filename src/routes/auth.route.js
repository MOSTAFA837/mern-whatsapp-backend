import express from "express";
import { register } from "../controllers/auth.controller.js";
// import trimRequest from "trim-request";

const router = express.Router();

router.route("/register").post(register);

export default router;
