import { Response, Router } from "express";
import { authorRouter } from "./authors.route";
import { quotesRouter } from "./quotes.route";
import { authRouter } from "./authenticate.route";
import swaggerUI from "swagger-ui-express";

import swaggerDocs from "./swagger.json";

const router = Router();
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
router.use(authorRouter);
router.use(quotesRouter);
router.use(authRouter);

router.get("/ping", (_, res: Response) => {
  return res.status(200).json({ message: "API is running!" });
});

export {
  router as apiRouter
};
