const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const winston = require("winston");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 5000;

const SECRET_KEY = "6LepYnkoAAAAANdKmTb899omcgUo3avxIAVzn_Te";

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "submission-logs.log" }),
  ],
});

app.post("/verify", (req, res) => {
  const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${req.body["g-recaptcha-response"]}`;

  axios
    .post(VERIFY_URL)
    .then((response) => {
      // Capture the current timestamp
      const submissionTimestamp = new Date();

      // Log the submission data along with the timestamp
      logger.info({
        timestamp: submissionTimestamp,
        email: req.body.email,
        selectedTypes: req.body.selectedTypes,
        selectedReasons: req.body.selectedReasons,
        verificationStatus: response.data.success ? "Success" : "Failure",
      });

      res.send(response.data);
    })
    .catch((error) => {
      logger.error("Error occurred during verification:", error);
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfully!" });
});

app.listen(port, () => {
  console.log("Server started on: " + port);
});
