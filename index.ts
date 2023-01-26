import express, { Express } from "express";
import dotenv from "dotenv";
import user from "./routes/user";
import vendor from "./routes/vendor";
import cors from "cors";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const path = "/api/v1";

app.use(cors());
app.use(express.json());

app.use(path + "/user", user);
app.use(path + "/vendor", vendor);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
