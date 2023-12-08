const express = require("express");
const UserData = require("./models/Userdata");
require("./db/connect");
const Puppeteer = require("puppeteer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const port = 9090;
const app = express();
app.use(express.json());
app.use(cors());

////////// Create Data PDF //////////////

app.post("/createdata", async (req, res) => {
  try {
    let userinfo = new UserData(req.body);
    let result = await userinfo.save();
    res.status(201).json(result);
  } catch (err) {
    console.log("create Data err>>", err);
    res.json({ message: "create Data err>>", err });
  }
});

////////// Login Data  //////////////

app.post("/login", async (req, res) => {
  try {
    const registerid = req.body.register_id;
    if (registerid) {
      const matchData = await UserData.findOne({ register_id: registerid });
      console.log("registerid>>", matchData);
      if (matchData) {
        const Token = await matchData.generateAuthToken();
        let tokenMail = {
          name: matchData.name,
          registerID: matchData.register_id,
          jwtToken: Token,
        };
        console.log("matchData", tokenMail);
        res.status(201).json(tokenMail);
      } else {
        res.status(401).send({ message: "Invalid Registered Id and Name" });
      }
    } else {
      console.log("Please Fill All Fields");
      res.status(401).send({ message: "Please Fill All Fields" });
    }
  } catch (err) {
    console.log("loginuser Data err>>", err);
  }
});

////////// Get User Data PDF //////////////

app.get("/getuserdata/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trackId = await UserData.findOne({ register_id: id });
    res.status(201).json(trackId);
    console.log("userinfo>>>", trackId);
  } catch (err) {
    console.log("getuserdata Data err>>", err);
    res.status(401).json({ message: "getuserdata Data err>>", err });
  }
});

////////// Generate PDF //////////////

app.get("/report", async (req, res) => {
  try {
    const browser = await Puppeteer.launch({headless: false });
    const page = await browser.newPage();
    await page.goto("http://localhost:3000/report", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    await page.setViewport({ width: 1250, height: 1050 });
    const todayDate = new Date();
    const pdfFile = await page.pdf({
      path: `${path.join(
        __dirname,
        "../Frontend/public/files",
        todayDate.getTime() + ".pdf"
      )}`,
      format: "A4",
    });
    await browser.close();

    const pdfUrl = path.join(
      __dirname,
      "../Frontend/public/files",
      todayDate.getTime() + ".pdf"
    );

res.contentType('application/pdf');
res.send(pdfUrl);

    res.download(pdfUrl, function(err){
      if(err){
        console.log("Error downloading PDF:", err);
     res.status(500).send("Error downloading PDF");
      }
    });
  } catch (err) {
    console.log("Generate PDF err>>", err);
    res.json({ message: "Generate PDF err>>", err });
  }
});

app.listen(port, () => {
  console.log(`connetion is setup at ${port}`);
});
