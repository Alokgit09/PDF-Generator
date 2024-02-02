const express = require("express");
const UserData = require("./models/Userdata");
const PdfData = require("./models/Pdfpathdata");
require("./db/connect");
const CandinetList = require("./controllers/Candinetlist");
const generatePdfonClick = require("./controllers/Generatepdfclick");
const GetfilteridName = require("./controllers/Fillter");
const { adminRegistration, adminLogininfo } = require("./controllers/LoginSignUp");
const Auth = require('./Middelware/Auth');


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

console.log(path.resolve(__dirname, "./invoices_pdf"));

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


////////// Get User Data PDF //////////////

app.get("/getuserdata/:id", async (req, res) => {
  // require('./public/invoices_pdf/');
  try {
    const { id } = req.params;
    const trackId = await PdfData.findOne({ register_id: id });
    const pdfPathuser = path.join(__dirname, `./public/${trackId.pdfPath}`);
    if (fs.existsSync(pdfPathuser)) {
      res.setHeader('Content-Type', 'application/pdf');
      console.log("pdfPathuser>>", pdfPathuser);
      res.send(
        `/${trackId.pdfPath}`
      )
    } else {
      res.status(404).send('PDF File Not Found');
    }

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
      const pdfPath = `/invoices_pdf/${todayDate.getTime()}.pdf`;
      console.log("Writing>>", pdfPath)
      const PDFurl = theOutput.pipe(
        fs.createWriteStream(path.resolve(__dirname, `./public/${pdfPath}`))
      );


      let userPdf = await PdfData.create({
        register_id: matchData.register_id,
        pdfPath: pdfPath,
      });

      console.log('check>>>', userPdf);

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

      ////////  Top Section ////////

      theOutput
        // .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#000000")
        .fontSize(14)
        .text(`Register-Id:- ${matchData.register_id}`, 65, 70, { align: "left" })
        .text(`E-Mail: ${matchData.email}`, 65, 90, { align: "left" })
        .text(`Phone No.: ${matchData.contact_number}`, 65, 110, { align: "left" })
        .image('./photos/download.png', 370, 35, { width: 100 })
        .fontSize(14)
        .text(`${matchData.address}`, 200, 70, { align: "right" })
        .text(`${matchData.city} (${matchData.pincode})`, 200, 90, { align: "right" })
        .text(`(${matchData.state}) ${matchData.country}`, 200, 110, { align: "right" })

        .moveDown();

      ////////  Middle Section ////////

      jumpLine(theOutput, 1);

      theOutput
        .fillColor("#0e8cc3")
        .fontSize(37)
        .font('./font/Fondamento/Fondregular.ttf')
        .text("Certificate of Half Marathon", { align: "center", width: '460', bold: "true" })
        .fillColor("#000000")
        .fontSize(18)
        .text("This Certificate Presented to", { align: "center", width: '443' }, jumpLine(theOutput, 1))
        .fillColor("#946F3C")
        .fontSize(25)
        .font('Times-Roman')
        .text(`${matchData.name}`, { align: "center", width: '443' })
        .fillColor("#000000")
        .fontSize(14)
        .text("The certificate of achievement is awarded to individuals who have demonstrated outstanding performance in their field. Here’s an example text for a certificate.",
          { align: "center", width: '443', }, jumpLine(theOutput, 1));



      ////////  Bottom Section //////// 
      theOutput
        .fillColor("#000000")
        .fontSize(15)
        .text(`Date of Birth: ${matchData.date_of_birth}`, 65, 380, { align: "left" })
        .text(`Gender: ${matchData.gender}`, 65, 380, { align: "center" })
        .text(`Blood Group: ${matchData.blood_group}`, 200, 380, { align: "right" })
        .moveDown();



      theOutput
        // .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#000000")
        .fontSize(14)
        .text(`${matchData.registration_time}`, 55, 460, { align: "center", width: 200 })
        .text("_______________________", 65, 470, { align: "left", width: 210 })
        .text("DATE-TIME", 55, 490, { align: "center", width: 200, bold: "true" })
        .image('./photos/botlogo.png', 360, 430, { width: 120 })
        .fontSize(14)
        .text("_______________________", 200, 470, { align: "right" })
        .text("SIGNATURE", 640, 490, { bold: "true" })

        .moveDown();

      const filePath = path.join(
        __dirname,
        `./invoices_pdf/${todayDate.getTime()}.pdf`
      );
      const absolutePath = path.resolve(filePath);
      console.log("filePath>>>", absolutePath);
      if (fs.existsSync(absolutePath)) {
        res.status(201).sendFile(absolutePath);
      } else {
        console.log("File not found");
        res.status(201).send(pdfPath);
      }

      theOutput.end();
    } else {
      console.log("Ragister ID is not Matched");
    }
  } catch (err) {
    console.log("get-Err>>", err);
  }
});


app.get('/allcandidates', Auth, CandinetList);

app.post('/clickgetpdf/:id', generatePdfonClick);

app.get('/getidname/?', GetfilteridName);

app.post('/signup', adminRegistration);

app.post('/login', adminLogininfo);









app.listen(port, () => {
  console.log(`connetion is setup at ${port}`);
});



