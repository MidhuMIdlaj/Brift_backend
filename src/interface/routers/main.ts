import { Router } from "express";
import adminRouter from "./admin/registration-company-router.js";
import commonRouter from "./common/auth-router.js";
import companyRouter from "./super-admin/company-router.js";
import moduleRouter from "./super-admin/module-router.js";

const router = Router();
// Admin routes
router.use("/admin/registration", adminRouter);

// Common routes
router.use("/common/auth", commonRouter);

//super-admin routes
router.use("/super-admin/companies", companyRouter);
router.use("/super-admin/modules", moduleRouter);


export default router;