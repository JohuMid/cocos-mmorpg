console.log("auth 服务");
import bodyParser from "body-parser";
import express from "express";
import mysql from "mysql";
import dayjs from "dayjs";
// @ts-ignore
import Crypto from "node-jsencrypt";
import { AuthService, CheckTokenRes, CheckTokenResData, PrivateKey } from "../common";

import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";
import * as grpc from "@grpc/grpc-js";

const cache = new Map();

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

app.post("/login", (req, res) => {
  let { account, password } = req.body;
  account = Crypt.decrypt(account);
  password = Crypt.decrypt(password);
  console.log(account);
  console.log(password);
  const hash = createHash("md5");
  hash.update(password);
  const passwordHash = hash.digest("hex");
  connection.query(
    "SELECT * FROM `user` WHERE `account` = ? AND `password` = ?",
    [account, passwordHash],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: "Internal server error" });
        return;
      }
      if (results.length > 0) {
        const token = uuidv4();
        cache.set(token, account);

        res.json({ token });
      }
      console.log(results);

    }
  );
});


app.listen(3000, () => {
  console.log("auth 服务启动在 3000 端口");
});

const server = new grpc.Server();
server.addService(AuthService, {
  checkToken: (call: any, callback: any) => {
    const token = call.request.getToken();

    const res = new CheckTokenRes();
    if (cache.has(token)) {
      const data = new CheckTokenResData();
      data.setAccount(cache.get(token));
      res.setData(data);
    } else {
      res.setError("token not exists")
    }
    callback(null, res);
  },
});

