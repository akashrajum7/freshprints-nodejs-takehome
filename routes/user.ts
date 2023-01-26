import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Apparel, Order } from "../types";
import fs from "fs";
const routes: Router = Router();

routes.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello User!" });
});

routes.post(
  "/fulfill",
  body("orders").isArray(),
  body("orders.*.code").isString(),
  body("orders.*.size").isString(),
  body("orders.*.quantity").isNumeric(),
  body("orders.*.quality").isNumeric(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Read the order from the request
    const { orders } = req.body as { orders: Order[] };
    // Read the apparel.json file and search for the apparel code and size. If found, update the stock. If not found, return an error message.
    // If the stock is insufficient, return an error message.
    // If the stock is sufficient, return the total price.
    // If the stock is sufficient, update the stock in the apparel.json file.

    // Initialise the total price and canFulfillOrder variables
    let totalPrice = 0;
    let canFulfillOrder = true;

    // Read the apparel.json file
    fs.readFile("apparel.json", "utf-8", (err: any, data: any) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      // Parse the apparel.json file
      const apparel: Apparel[] = JSON.parse(data);

      // Loop through the order
      orders.forEach((item: Order) => {
        // Find the apparel in the apparel.json file
        const apparelIndex = apparel.findIndex(
          (apparel: Apparel) =>
            apparel.code === item.code &&
            apparel.size === item.size &&
            apparel.quality === item.quality &&
            apparel.stock >= item.quantity
        );

        // If the apparel is not found, set canFulfillOrder to false
        if (apparelIndex === -1) {
          canFulfillOrder = false;
          return;
        }
        // If the stock is sufficient, update the stock in the apparel.json file
        apparel[apparelIndex].stock -= item.quantity;
        // Update the total price
        totalPrice += apparel[apparelIndex].price * item.quantity;
      });

      // If the stock is insufficient, return an error message
      if (!canFulfillOrder) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      // Write the updated apparel.json file
      fs.writeFile(
        "apparel.json",
        JSON.stringify(apparel, null, 2),
        (err: any) => {
          if (err) {
            return res.status(500).json({ message: "Server error" });
          }
        }
      );

      // Return the total price
      return res.status(200).json({ totalPrice });
    });
  }
);

routes.post(
  "/cheapest",
  body("orders").isArray(),
  body("orders.*.code").isString(),
  body("orders.*.size").isString(),
  body("orders.*.quantity").isNumeric(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Read the order from the request
    const { orders } = req.body as { orders: Order[] };
    // Read the apparel.json file and search for the apparel code and size. If found, update the stock. If not found, return an error message.
    // If the stock is insufficient, return an error message.
    // If the stock is sufficient, return the total price.
    // If the stock is sufficient, update the stock in the apparel.json file.

    // Initialise the total price and canFulfillOrder variables
    let totalPrice = 0;
    let canFulfillOrder = true;

    // Read the apparel.json file
    fs.readFile("apparel.json", "utf-8", (err: any, data: any) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      // Parse the apparel.json file
      const apparel: Apparel[] = JSON.parse(data);
      let cheapestApparel: Apparel[] = [];
      let totalPrice: number = 0;

      // Loop through the order and find the cheapest apparel that can fulfill the order
      orders.forEach((item: Order) => {
        // Filter the apparel that can fulfill the order and sort by price
        const filteredApparel = apparel
          .filter(
            (apparel: Apparel) =>
              apparel.code === item.code &&
              apparel.size === item.size &&
              apparel.stock >= item.quantity
          )
          .sort((a: Apparel, b: Apparel) => a.price - b.price);

        // If the apparel is not found, set canFulfillOrder to false
        if (filteredApparel.length === 0) {
          canFulfillOrder = false;
          return;
        }

        // Update the total price
        totalPrice += filteredApparel[0].price * item.quantity;
        // Update the cheapest apparel
        cheapestApparel.push(filteredApparel[0]);
      });
      // Return the total price
      return res.status(200).json({ totalPrice, apparel: cheapestApparel });
    });
  }
);

export default routes;
