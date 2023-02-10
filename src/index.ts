import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { apiRouter } from "./infra/http-api/routes";

const app = express();
app.use(express.json());
app.use(apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Server starts at http://localhost:${PORT}`);
});