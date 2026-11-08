import { Router } from "express";
import {
  createReadingController,
  deleteReadingController,
  getReadingController,
  listReadingsController,
  updateReadingController,
} from "../controllers/index.js";

const route = Router();

route.get("/readings", listReadingsController);
route.post("/readings", createReadingController);
route.get("/readings/:id", getReadingController);
route.patch("/readings/:id", updateReadingController);
route.delete("/readings/:id", deleteReadingController);

export default route;
