require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(bodyParser.json());

// POST Route to send email
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({ success: false, msg: "All fields are required!" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMINEMAIL,
        pass: process.env.PASS,
      },
    });

    // =============================
    // 1) ADMIN EMAIL TEMPLATE
    // =============================

    const adminMail = {
      from: `"NO-REPLY" <${process.env.ADMINEMAIL}>`,
      to: process.env.ADMINEMAIL,
      subject: `New Message From ${name}`,
      html: `
      <div style="max-width:520px;margin:auto;padding:20px;background:#0d1117;
                  border-radius:12px;font-family:Arial;color:#fff;
                  border:1px solid #222;">
        
        <h2 style="margin-bottom:8px;font-size:22px;color:#38bdf8;">
          📩 New Message From ${name}
        </h2>

        <p style="margin:0;font-size:14px;color:#c9d1d9;">
          You received a new message from your 1000XAi contact form.
        </p>

        <div style="margin-top:18px;padding:16px;background:#161b22;border-radius:10px;">
          <p style="margin:6px 0;color:#9ecbff;"><strong>Name:</strong> ${name}</p>
          <p style="margin:6px 0;color:#9ecbff;"><strong>Email:</strong> ${email}</p>

          <p style="margin-top:14px;color:#58a6ff;"><strong>Message:</strong></p>
          <p style="white-space:pre-line;color:#e6edf3;font-size:15px;
                    line-height:1.5;margin-top:6px;">
            ${message}
          </p>
        </div>

        <p style="margin-top:22px;color:#555;font-size:12px;text-align:center;">
          Sent via <strong>1000XAi Contact System</strong>
        </p>
      </div>
      `,
    };

    // =============================
    // 2) USER CONFIRMATION EMAIL
    // =============================

    const userMail = {
      from: `"1000XAi Support" <${process.env.ADMINEMAIL}>`,
      to: email,
      subject: `Thank You ${name}! We Received Your Message ✔️`,
      html: `
      <div style="max-width:520px;margin:auto;padding:20px;background:#0d1117;
                  border-radius:12px;font-family:Arial;color:#fff;
                  border:1px solid #222;">
        
        <h2 style="margin-bottom:8px;font-size:22px;color:#38bdf8;">
          🙏 Thank You, ${name}!
        </h2>

        <p style="margin:0;font-size:14px;color:#c9d1d9;line-height:1.6;">
          Your message has been successfully received by 
          <strong>1000XAi</strong>.  
          Our team will review it and get back to you shortly.
        </p>

        

        <p style="margin-top:22px;font-size:13px;color:#9fb2c7;text-align:center;">
          If you didn’t send this message, please ignore this email.
        </p>

        <p style="margin-top:6px;color:#555;font-size:12px;text-align:center;">
          © 1000XAi • AI-Powered Innovation
        </p>

      </div>
      `,
    };

    // =============================
    // SEND BOTH EMAILS
    // =============================

    await transporter.sendMail(adminMail);
    await transporter.sendMail(userMail);

    res.json({ success: true, msg: "Message Sent Successfully!" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, msg: "Error: " + error.message });
  }
});

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
