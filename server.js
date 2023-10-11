const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import Axios
const app = express();
const port = process.env.PORT || 5000;

const SECRET_KEY = "6LepYnkoAAAAANdKmTb899omcgUo3avxIAVzn_Te";

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/verify", (req, res) => {
  const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${req.body["g-recaptcha-response"]}`;

  axios
    .post(VERIFY_URL)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfuully simple !" });
});

app.listen(port, () => {
  console.log("Server started on: " + port);
});
