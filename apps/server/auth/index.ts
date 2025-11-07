console.log("auth 服务");
import bodyParser from "body-parser";
import express from "express";
// @ts-ignore
import Crypto from "node-jsencrypt";
import { PrivateKey } from "../common";

const Crypt = new Crypto();

Crypt.setKey(PrivateKey)


const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  let {account, password} = req.body;
  account = Crypt.decrypt(account);
  password = Crypt.decrypt(password);
  console.log(account);
  console.log(password);
  
  res.send({});
});

app.listen(3000, () => {
  console.log("auth 服务启动在 3000 端口");
});
