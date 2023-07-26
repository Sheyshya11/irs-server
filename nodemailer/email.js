const nodemailer = require("nodemailer");
const fs = require("fs");
var pdf = require("html-pdf");
const pdfTemplate = require("../helper/index");
require("dotenv").config();
const ejs = require("ejs");
const path = require('path')


module.exports.sendMail = async (req, res, next) => {
  const devices = req.body.devices;
  const name = req.body.name;
  const email = req.body.email;
  const initialDevices = devices.slice(0, 3);
  const remainingDevices = devices.slice(3, 6); // Get the remaining devices after the first 3
  const moreremainingDevices = devices.slice(6, 9);
  // Generate PDF for the initial devices


  const initialPdfContent = pdfTemplate({
    name: name,
    devices: initialDevices,
  });

  pdf
    .create(initialPdfContent, {
      childProcessOptions: {
        env: {
          OPENSSL_CONF: "/dev/null",
        },
      },
    })
    .toFile("initial_result.pdf", function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log("Initial PDF generated successfully");
        console.log(res);
      }
    });

  // // Generate PDF for the remaining devices (if any)
  if (remainingDevices.length > 0) {
    const remainingPdfContent = pdfTemplate({
      name: name,
      devices: remainingDevices,
    });

    pdf
      .create(remainingPdfContent, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
      .toFile("remaining_result.pdf", function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("Remaining PDF generated successfully");
          console.log(res);
        }
      });
  }

  if (moreremainingDevices.length > 0) {
    const moreremainingPdfContent = pdfTemplate({
      name: name,
      devices: moreremainingDevices,
    });

    pdf
      .create(moreremainingPdfContent, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: "/dev/null",
          },
        },
      })
      .toFile("more_remaining_result.pdf", function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("Remaining PDF generated successfully");
          console.log(res);
        }
      });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const templatepath = path.join(process.cwd(),"views",'template.ejs')
  const initialPath = path.join(process.cwd(),"initial_result.pdf")
  const remainingPath = path.join(process.cwd(),"remaining_result.pdf")
  const more_remainingPath = path.join(process.cwd(),"more_remaining_result.pdf")
  const ejsTemplate = fs.readFileSync(
    // "/home/subham/Desktop/IRS main folder/server/views/template.ejs",
    templatepath,
    "utf-8"
  );

  // Render the EJS template with data
  const renderedHtml = ejs.render(ejsTemplate, { username: name });

  const mailOptions = {
    from: "hello@example.com",
    to: `${email}`,
    subject: "Regarding Item Acquisition Process",
    html: renderedHtml,
    attachments: [
      {
        filename: "initial_result.pdf",
        path: initialPath,
        contentType: "application/pdf",
      },
      // Add the second attachment only if the second PDF is generated
      remainingDevices.length > 0
        ? {
            filename: "remaining_result.pdf",
            path: remainingPath,
            contentType: "application/pdf",
          }
        : {},
      moreremainingDevices.length > 0
        ? {
            filename: "more_remaining_result.pdf",
            path: more_remainingPath,
            contentType: "application/pdf",
          }
        : {},
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  next();
};

