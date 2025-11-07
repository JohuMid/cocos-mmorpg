console.log("auth 服务");
import bodyParser from "body-parser";
import express from "express";
import mysql from "mysql";
import dayjs from "dayjs";
// @ts-ignore
import Crypto from "node-jsencrypt";
import { PrivateKey } from "../common";

import { createHash } from "crypto";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "mmodb"
});
connection.connect();

const Crypt = new Crypto();

Crypt.setKey(PrivateKey)


const app = express();
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

app.post("/register", (req, res) => {
  let { account, password } = req.body;
  account = Crypt.decrypt(account);
  password = Crypt.decrypt(password);
  console.log(account);
  console.log(password);

  const hash = createHash("md5");
  hash.update(password);
  const passwordHash = hash.digest("hex");

  connection.query(
    "INSERT INTO user (account, password,created_time) VALUES (?, ?,?)",
    [account, passwordHash, dayjs().format("YYYY-MM-DD HH:mm:ss")],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: "Internal server error" });
        return;
      }
      console.log(results);
      res.send({});
    }
  );
});

app.listen(3000, () => {
  console.log("auth 服务启动在 3000 端口");
});
