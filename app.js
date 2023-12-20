import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
dotenv.config();
import { scheduleMeet } from "./api/scheduleMeet.js";

const app = express();

app.use(bodyParser.json());

app.route("/api/schedule_meet").post((req, res) => {
  scheduleMeet(req, res);
});

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`> Ready on http://localhost:${PORT}`);
});

export { app };
