import { Router, Request, Response } from "express";
const routes: Router = Router();
import { body, validationResult } from "express-validator";
import fs from "fs";
import { Apparel } from "../types";

routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello Vendor!" });
});

// Get all apparel
routes.get("/apparel", (req: Request, res: Response) => {
  // Read the apparel.json file and return the apparel
  fs.readFile("apparel.json", "utf-8", (err: any, data: any) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    return res.status(200).json(JSON.parse(data));
  });
});

routes.patch(
  "/apparel/:code/:size",
  body("quality")
    .custom(
      (quality) => typeof quality === "number" && quality >= 0 && quality <= 5
    )
    .optional(),
  body("price")
    .custom((price) => typeof price === "number" && price >= 0)
    .optional(),
  body("stock")
    .custom((stock) => typeof stock === "number" && stock >= 0)
    .optional(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Read the apparel code, size, quality and price from the request
    const { code, size } = req.params;
    const { quality, price, stock } = req.body;

    // Read the apparel.json file and search for the apparel code and size. If found, update the quality and price. If not found, return an error message.
    fs.readFile("apparel.json", "utf-8", (err: any, data: any) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      const apparel: Apparel[] = JSON.parse(data);

      const apparelIndex = apparel.findIndex(
        (apparel: Apparel) => apparel.code === code && apparel.size === size
      );

      if (apparelIndex === -1) {
        return res.status(404).json({ message: "Apparel not found" });
      }

      if (quality) {
        apparel[apparelIndex].quality = quality;
      }

      if (price) {
        apparel[apparelIndex].price = price;
      }

      if (stock) {
        apparel[apparelIndex].stock = stock;
      }

      // Write the updated apparel.json file and return the updated stock.
      fs.writeFile(
        "apparel.json",
        JSON.stringify(apparel, null, 2),
        (err: any) => {
          if (err) {
            return res.status(500).json({ message: "Server error" });
          }
          return res.status(200).json(apparel[apparelIndex]);
        }
      );
    });
  }
);

export default routes;
