require("dotenv").config();
var cloudinary = require("cloudinary").v2;
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 8000, () => {
  console.log(`Connected to port ${process.env.PORT || 8000}`);
});

app.get("/", (req, res) => {
  res.send(`Server is up and running`);
});

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.post("/images", upload.array("files"), async (req, res) => {
  const cRes = await cloudinary.uploader.upload(req.files[0].path);
  const url = cRes.url;
  res.send(url);

  req.files.forEach(async (file, i) => {
    try {
      await unlinkAsync(file.path);
    } catch (err) {
      console.log(err);
    }
  });
});

app.get("/images", async (req, res) => {
  const queryParams = req.query;
  const { load } = queryParams;
  res.redirect(load);
});
