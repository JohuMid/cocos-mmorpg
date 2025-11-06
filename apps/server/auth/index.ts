console.log("auth 服务");
import express from "express";
const app = express();

app.get("/register", (req, res) => {
  res.send("register");
});

app.listen(3000, () => {
  console.log("auth 服务启动在 3000 端口");
});
