import express from "express";
import helmet from "helmet";
import pcdigaRoute from "./routes/pcdiga/pcdiga.js";

const port = process.env.PORT || 8080;
const app = express();
app.listen(port, () => console.log(`Server running on ${port}`));
app.use("/", (req, _res, next) => {
  console.log(new Date(), req.method, req.url);
  next();
});
app.use(helmet());

app.get("/", (_req, res) => {
  res.send("Welcome :D");
});

app.use("/pcdiga", pcdigaRoute);
// const test = { PCDiga: { price: 12, stock: true } };
