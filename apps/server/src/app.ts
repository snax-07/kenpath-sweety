import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/routes/index.js";
import readingsRoutes from "./modules/readings/routes/index.js";
import reportsRoutes from "./modules/reports/routes/index.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use((req, _res, next) => {
  const request = req as typeof req & { cookies?: Record<string, string> };
  const rawCookies = req.headers.cookie ?? "";
  const cookies: Record<string, string> = {};
  for (const cookie of rawCookies.split(";")) {
    const trimmed = cookie.trim();
    if (!trimmed) continue;
    const separatorIndex = trimmed.indexOf("=");
    const key = separatorIndex >= 0 ? trimmed.slice(0, separatorIndex) : trimmed;
    const value = separatorIndex >= 0 ? trimmed.slice(separatorIndex + 1) : "";
    cookies[key] = decodeURIComponent(value);
  }

  request.cookies = cookies;
  next();
});

app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1", readingsRoutes);
app.use("/api/v1", reportsRoutes);

app.get("/health", (_req, res) => {
  return res.status(200).json({
    message: "server is working!",
    status: true,
  });
});

export default app;