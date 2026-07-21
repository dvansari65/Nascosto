import express from "express";
import cors from "cors";
import { createServer } from "http";
import { startIndexer } from "./listeners/listeners";
import { subscribeRouter, offerRouter, tokenIdsRouter } from "./routes";

export const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/subscribe", subscribeRouter);
app.use("/api/offers", offerRouter);
app.use("/api/tokenIds", tokenIdsRouter);

const server = createServer(app);

server.listen(3001, async () => {
  console.log("server started!!!", 3001);
  await startIndexer(); // start exactly once, at process startup
});
