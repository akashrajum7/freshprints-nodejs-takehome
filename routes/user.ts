import { Router, Request, Response } from "express";
const routes: Router = Router();

routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello User!" });
});

export default routes;
