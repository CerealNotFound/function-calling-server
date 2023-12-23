import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
dotenv.config();
import { functionCall } from "./api/functionCall.js";

const app = express();

app.use(bodyParser.json());

app.route("/api/function_call").post((req, res) => {
  functionCall(req, res);
});

const PORT = 3030;

app.listen(PORT, () => {
  console.log(`> Ready on http://localhost:${PORT}`);
});

export { app };
