const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExt);
  },
});

const upload = multer({ storage: storage });

// API endpoint for form submission with file upload
app.post("/api/send-email", upload.single("attachment"), async (req, res) => {
  try {
    // Extract form data
    const { fullName, emailAddress, contactNumber, service, message } =
      req.body;

    // Save form data to JSON file
    const formData = {
      fullName,
      emailAddress,
      contactNumber,
      service,
      message,
      submittedAt: new Date().toISOString(),
      filename: req.file ? req.file.filename : null,
    };

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Generate unique JSON filename
    const jsonFilename = `form-submission-${Date.now()}.json`;
    const jsonPath = path.join(dataDir, jsonFilename);

    // Write data to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(formData, null, 2));

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail app password
      },
    });

    // Prepare email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "llakshitmathur239@gmail.com",
      subject: `New Contact Form Submission: ${service}`,
      text: `
        Name: ${fullName}
        Email: ${emailAddress}
        Phone: ${contactNumber}
        Service: ${service}

        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${emailAddress}</p>
        <p><strong>Phone:</strong> ${contactNumber}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Add attachment if file was uploaded
    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ];
    }

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      data: {
        jsonFile: jsonFilename,
        attachment: req.file ? req.file.filename : null,
      },
    });
  } catch (error) {
    console.error("Error processing form submission:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process form submission" });
  }
});

// New API endpoint for sending email directly from client-side button click
app.post("/api/send-email-to-user", async (req, res) => {
  try {
    // Extract form data
    const { fullName, emailAddress, contactNumber, service, message } =
      req.body;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email to send to the user
    const mailOptions = {
      from: "your-email@gmail.com",
      to: "llakshitmathur239@gmail.com", // Send to the specified email
      subject: `New Contact Form Submission: ${service}`,
      text: `
        Name: ${fullName}
        Email: ${emailAddress}
        Phone: ${contactNumber}
        Service: ${service}

        Message:
        ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${emailAddress}</p>
        <p><strong>Phone:</strong> ${contactNumber}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
