const express = require("express");
const UserData = require("./models/Userdata");
require("./db/connect");
const Puppeteer = require("puppeteer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
// const pdf = require("html-pdf");
const PDFGenerator = require("pdfkit");
const multer = require("multer");
const csv = require("csvtojson");
const bodyParser = require("body-parser");
//  require('');

const port = 9090;
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

app.post("/importData", upload.single("file"), async (req, res) => {
  try {
    let UserInfo = [];
    csv()
      .fromFile(req.file.path)
      .then(async (response) => {
        for (let x = 0; x < response.length; x++) {
          UserInfo.push({
            register_id: response[x].Registration_Id,
            name: response[x].Name,
            email: response[x].Email,
            status: response[x].Status,
            ticket_name: response[x].Ticket_Name,
            order_Id: response[x].Order_Id,
            transaction_status: response[x].Transaction_Status,
            ticket_price: response[x].Ticket_Price,
            registration_time: response[x].Registration_Time,
            contact_number: response[x].Contact_Number,
            gender: response[x].Gender,
            blood_group: response[x].Blood_Group,
            address: response[x].Address,
            city: response[x].City,
            state: response[x].State,
            pincode: response[x].Pincode,
            country: response[x].Country,
            date_of_birth: response[x].Bate_of_Birth,
            attendee_check_in: response[x].Attendee_Check_In,
          });
        }
        await UserData.insertMany(UserInfo);
      });

    res.send({ status: 200, success: true, msg: "CSV Imported" });
  } catch (err) {
    console.error("importDataerr>>", err);
    res.send({ status: 400, success: false, msg: err.message });
  }
});

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

app.post("/generatpdf/:id", async (req, res) => {
  try {
    const task_id = req.params.id;
    const distanceMargin = 18;

    function jumpLine(theOutput, lines) {
      for (let index = 0; index < lines; index++) {
        theOutput.moveDown();
      }
    }

    const matchData = await UserData.findOne({ register_id: task_id });
    console.log("findUser>>>", matchData);
    if (matchData) {
      let theOutput = new PDFGenerator({
        layout: "landscape",
        size: "A4",
      });
      const todayDate = new Date();
      // pipe to a writable stream which would save the result into the same directory
      const PDFurl = theOutput.pipe(
        fs.createWriteStream(`./invoices_pdf/${todayDate.getTime()}.pdf`)
      );
      theOutput
        .rect(0, 0, theOutput.page.width, theOutput.page.height)
        .fill("#fff");
      theOutput
        .fillAndStroke("#0e8cc3")
        .lineWidth(20)
        .lineJoin("round")
        .rect(
          distanceMargin,
          distanceMargin,
          theOutput.page.width - distanceMargin * 2,
          theOutput.page.height - distanceMargin * 2
        )
        .stroke();


      theOutput
        // .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("ACME Inc.", 110, 57)
        .fontSize(10)
        .text("ACME Inc.", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown();


      jumpLine(theOutput, 4);
      theOutput.fontSize(13).fill("#021c27").text("CERTIFICATE OF COMPLETION", {
        align: "center",
      });
      jumpLine(theOutput, 1);
      theOutput.fontSize(11).fill("#021c27").text("Present to", {
        align: "center",
      });
      jumpLine(theOutput, 1);
      theOutput.fontSize(20).fill("#000000").text(`${matchData.name}`, {
        align: "center",
      });

      /////Address Info////

      theOutput
        .fontSize(14)
        .fill("#000000")
        .text(`Address: ${matchData.address}`, 50, 400, {
          align: "right",
        });

      const filePath = path.join(
        __dirname,
        `./invoices_pdf/${todayDate.getTime()}.pdf`
      );
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send("File not found");
      }
      theOutput.end();
    } else {
      console.log("Ragister ID is not Matched");
      res.status(404).send("Ragister ID is not Matched");
    }
  } catch (err) {
    console.log("get-Err>>", err);
  }
});

app.listen(port, () => {
  console.log(`connetion is setup at ${port}`);
});
