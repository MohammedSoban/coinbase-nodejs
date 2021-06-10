const express = require("express");
const app = express();
const { Client, Webhook, resources } = require("coinbase-commerce-node");
const bodyParser = require("body-parser");
const cors = require("cors");
Client.init("89ba80f7-d15c-48a7-ab78-b9293636f6f0");

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

var jsonParser = bodyParser.json();
const { Charge } = resources;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/createCharge", jsonParser, (req, res) => {
  console.log("hello");
  // cors(req, res, () => {
  const chargeData = {
    name: "widget",
    description: "unkown widegt",
    local_price: {
      amount: 1,
      currency: "USD",
    },
    pricing_type: "fixed_price",
    metadata: {
      user: "rajat21",
    },
  };
  // res.send({ hello: "hello" });
  Charge.create(chargeData)
    .then((response) => {
      // res.status(200);
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
    });
  // });
});

app.post("/webhookHandler", jsonParser, (req, res) => {
  const rawBody = req.body;
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = "f454be6d-188a-44e7-8c89-fa34be66f439";

  //console.log(req.headers);
  console.log(rawBody);
  // console.log(signature);

  try {
    const event = Webhook.verifyEventBody(
      JSON.stringify(rawBody),
      signature,
      webhookSecret
    );

    if (event.type === "charge:pending") {
      res.status(200).send("pending");
    }
    if (event.type === "charge:confirmed") {
      res.status(200).send("confirmed");
    }
    if (event.type === "charge:failed") {
      res.status(200).send("failed");
    }

    res.send(`success ${event.id}`);
  } catch (error) {
    console.error(error);
    res.status(400).send("failure!");
  }
});

app.listen(9000, () => console.log("Listening on port 9000"));

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
