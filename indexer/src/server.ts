import express from "express";
import cors from "cors";
import { createServer } from "http";
import { startIndexer } from "./listeners/listeners";
import { subscribeRouter, offerRouter, tokenIdsRouter } from "./routes";

export const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/subscribe", subscribeRouter);
app.use("/api/offers", offerRouter);
app.use("/api/tokenIds", tokenIdsRouter);

const server = createServer(app);

server.listen(PORT, async () => {
  console.log("server started!!!", PORT);
  await startIndexer(); // start exactly once, at process startup
});
