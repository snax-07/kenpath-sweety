import { Router } from "express";
import {
  getDailyReportController,
  getMonthToDateReportController,
  getPreviousMonthReportController,
  getRangeReportController,
} from "../controllers/index.js";

const route = Router();

route.get("/reports/daily", getDailyReportController);
route.get("/reports/month-to-date", getMonthToDateReportController);
route.get("/reports/monthly", getPreviousMonthReportController);
route.get("/reports/range", getRangeReportController);

export default route;
