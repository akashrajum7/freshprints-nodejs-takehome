import { Router } from "express";
const routes = Router();

routes.get("/", (req, res) => {
  res.json({ message: "Hello Vendor!" });
});

export default routes;
