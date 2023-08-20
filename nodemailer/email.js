const nodemailer = require("nodemailer");
const fs = require("fs");
var pdf = require("html-pdf");
const pdfTemplate = require("../helper/index");
require("dotenv").config();
const ejs = require("ejs");
const path = require("path");

async function generatePDFFile(fileName, content) {
  return new Promise((resolve, reject) => {
    pdf
      .create(content, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
      .toFile(fileName, function (err, res) {
        if (err) {
          reject(err);
        } else {
          console.log(`${fileName} generated successfully`);
          console.log(res);
          resolve();
        }
      });
  });
}

async function generatePDFs(devices, name) {
  let startIndex = 0;
  let pdfIndex = 1;
  while (startIndex < devices.length) {
    const endIndex = Math.min(startIndex + 3, devices.length);
    const content = pdfTemplate({
      name: name,
      devices: devices.slice(startIndex, endIndex),
    });
    const fileName = `devices_${pdfIndex}.pdf`;
    await generatePDFFile(fileName, content);
    startIndex = endIndex;
    pdfIndex++;
  }
}

module.exports.sendMail = async (req, res, next) => {
  const devices = req.body.devices;
  const name = req.body.name;
  const email = req.body.email;

  // Generate PDF for the initial devices

  try {
    await generatePDFs(devices, name);
    await sendEmail(name, email, devices);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//send mail
async function sendEmail(name, email, devices) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const templatepath = path.join(process.cwd(), "views", "template.ejs");
  const ejsTemplate = fs.readFileSync(templatepath, "utf-8");

  // Render the EJS template with data
  const renderedHtml = ejs.render(ejsTemplate, { username: name });

  const directoryPath = process.cwd();
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Filter the files that start with "devices_" and end with ".pdf"
    const pdfFiles = files.filter(
      (file) => file.startsWith("devices_") && file.endsWith(".pdf")
    );

    // Create attachments array
    const attachments = pdfFiles.map((file, index) => ({
      filename: file,
      path: path.join(directoryPath, file),
      contentType: "application/pdf",
    }));

    const mailOptions = {
      from: "hello@example.com",
      to: email,
      subject: "Regarding Item Acquisition Process",
      html: renderedHtml,
      attachments: attachments,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        // Delete the generated PDF files
        deleteFilesStartingWithPDF();
      }
    });
  });
}

//delete files
function deleteFilesStartingWithPDF() {
  const directoryPath = process.cwd();

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // Filter the files that start with "devices_" and end with ".pdf"
    const pdfFiles = files.filter(
      (file) => file.startsWith("devices_") && file.endsWith(".pdf")
    );

    // Delete each PDF file
    pdfFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted:", filePath);
        }
      });
    });
  });
}