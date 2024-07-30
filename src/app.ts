import express from "express";
import bodyParser from "body-parser";

import chat from './chat/configChat'
import router from "./routes/route";

const PORT = process.env.PORT || 10101;

const app = express().use(bodyParser.json());

app.use("/", router);
app.use("/gemini", chat);

app
  .listen(PORT, () => {
    console.log("Servidor ejecutándose en el puerto: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
