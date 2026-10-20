const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const AdoptionEnquiry = require("./models/AdoptionEnquiry");
const User = require("./models/User");

const router = express.Router();

const VALID_STATUSES = ["New", "Contacted", "Closed"];

// ==================================================
// EMAIL TRANSPORTER
// Create it lazily so environment variables have
// already been loaded before the first email.
// ==================================================

let emailTransporter = null;

function getEmailTransporter() {
  if (!emailTransporter) {
    emailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD?.replace(/\s/g, ""),
      },
    });
  }

  return emailTransporter;
}

// ==================================================
// HTML ESCAPING
// ==================================================

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

// ==================================================
// EMAIL DELIVERY
// Logs whether Gmail accepted or rejected recipients.
// Acceptance by Gmail does not guarantee inbox delivery.
// ==================================================

async function sendNotificationEmail(options) {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_APP_PASSWORD
  ) {
    console.error(
      "[PawMart Email] EMAIL_USER or EMAIL_APP_PASSWORD is missing."
    );

    return {
      sent: false,
      reason: "Email service is not configured.",
    };
  }

  try {
    const transporter = getEmailTransporter();

    const info = await transporter.sendMail({
      ...options,
      from: `"PawMart" <${process.env.EMAIL_USER}>`,
    });

    const accepted = Array.isArray(info.accepted)
      ? info.accepted
      : [];

    const rejected = Array.isArray(info.rejected)
      ? info.rejected
      : [];

    console.log("\n========== PAWMART EMAIL RESULT ==========");
    console.log("Subject:", options.subject);
    console.log("Accepted recipients:", accepted);
    console.log("Rejected recipients:", rejected);
    console.log("SMTP response:", info.response);
    console.log("Message ID:", info.messageId);
    console.log("==========================================\n");

    if (accepted.length === 0) {
      return {
        sent: false,
        reason: "The email server did not accept any recipients.",
      };
    }

    return {
      sent: true,
      reason: "The email server accepted the message.",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("[PawMart Email] Delivery failed:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
    });

    return {
      sent: false,
      reason: error.message,
    };
  }
}

// ==================================================
// APPLICANT CONFIRMATION EMAIL
// ==================================================

async function sendApplicantConfirmation(enquiry, reference) {
  const petName = escapeHtml(enquiry.petName);
  const applicantName = escapeHtml(enquiry.name);
  const petBreed = escapeHtml(
    enquiry.petBreed || "Not specified"
  );
  const petType = escapeHtml(enquiry.petType || "Pet");
  const petLocation = escapeHtml(
    enquiry.petLocation || "Not specified"
  );

  return sendNotificationEmail({
    to: enquiry.email,

    subject: `PawMart Adoption Enquiry Confirmation - ${reference}`,

    text: `
Hello ${enquiry.name},

Thank you for contacting PawMart about adopting ${enquiry.petName}.

We have successfully received your adoption enquiry.

Enquiry reference: ${reference}
Pet name: ${enquiry.petName}
Breed: ${enquiry.petBreed || "Not specified"}
Pet type: ${enquiry.petType || "Pet"}

Your enquiry has been saved for review.

Please keep your enquiry reference for future communication.

This email confirms receipt of your enquiry. It does not confirm an adoption or guarantee that the pet is available.

Thank you,
PawMart Team
    `.trim(),

    html: `
      <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 600px;
        margin: 20px auto;
        border: 1px solid #e9e5f5;
        border-radius: 16px;
        overflow: hidden;
        color: #29253b;
      ">
        <div style="
          padding: 28px 24px;
          background: #7356d8;
          color: white;
          text-align: center;
        ">
          <h1 style="margin: 0; font-size: 29px;">
            PawMart 🐾
          </h1>

          <p style="margin: 10px 0 0;">
            Every pet deserves a loving home.
          </p>
        </div>

        <div style="padding: 28px 24px;">
          <h2 style="margin-top: 0;">
            Thank you, ${applicantName}!
          </h2>

          <p style="line-height: 1.8; color: #625f73;">
            We've received your adoption enquiry. Thank you for
            considering giving a pet a loving home.
          </p>

          <div style="
            margin: 22px 0;
            padding: 18px;
            background: #f5f2ff;
            border-radius: 12px;
            border: 1px solid #e4dcff;
          ">
            <p style="
              margin: 0 0 8px;
              color: #777087;
              font-size: 12px;
            ">
              YOUR ENQUIRY REFERENCE
            </p>

            <strong style="
              color: #6245c4;
              font-size: 22px;
              letter-spacing: 1px;
            ">
              ${reference}
            </strong>
          </div>

          <h3>Enquiry details</h3>

          <table style="
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          ">
            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Pet
              </td>
              <td style="padding: 10px 0; font-weight: bold;">
                ${petName}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Breed
              </td>
              <td style="padding: 10px 0;">
                ${petBreed}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Type
              </td>
              <td style="padding: 10px 0;">
                ${petType}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Location
              </td>
              <td style="padding: 10px 0;">
                ${petLocation}
              </td>
            </tr>
          </table>

          <div style="
            margin-top: 24px;
            padding: 16px;
            border-radius: 10px;
            background: #f8fafc;
            color: #626074;
            font-size: 13px;
            line-height: 1.8;
          ">
            <strong>What happens next?</strong>

            <p style="margin-bottom: 0;">
              The PawMart team can review your enquiry and contact
              you about the next steps. This email confirms receipt
              only and does not guarantee pet availability or adoption.
            </p>
          </div>

          <p style="
            margin-top: 28px;
            line-height: 1.8;
            color: #625f73;
          ">
            Thank you for choosing PawMart!<br />
            <strong>The PawMart Team</strong>
          </p>
        </div>

        <div style="
          padding: 16px;
          background: #f8f7fc;
          text-align: center;
          font-size: 11px;
          color: #89869b;
        ">
          Automated confirmation email from PawMart.
        </div>
      </div>
    `,
  });
}

// ==================================================
// ADMIN NOTIFICATION EMAIL
// ==================================================

async function sendAdminNotification(enquiry, reference) {
  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  if (!adminEmail) {
    console.error(
      "[PawMart Email] ADMIN_EMAIL and EMAIL_USER are missing."
    );

    return {
      sent: false,
      reason: "Administrator email is not configured.",
    };
  }

  const petName = escapeHtml(enquiry.petName);
  const petBreed = escapeHtml(
    enquiry.petBreed || "Not specified"
  );
  const petType = escapeHtml(enquiry.petType || "Pet");
  const petAge = escapeHtml(
    enquiry.petAge || "Not specified"
  );
  const petGender = escapeHtml(
    enquiry.petGender || "Not specified"
  );
  const petLocation = escapeHtml(
    enquiry.petLocation || "Not specified"
  );

  const applicantName = escapeHtml(enquiry.name);
  const applicantEmail = escapeHtml(enquiry.email);
  const applicantPhone = escapeHtml(enquiry.phone);
  const livingSituation = escapeHtml(
    enquiry.livingSituation
  );
  const applicantMessage = escapeHtml(enquiry.message);

  const dashboardOrigin = (
    process.env.CLIENT_ORIGIN || "http://localhost:5173"
  ).replace(/\/+$/, "");

  const dashboardUrl =
    `${dashboardOrigin}/admin/adoption-enquiries`;

  const safeDashboardUrl = escapeHtml(dashboardUrl);

  return sendNotificationEmail({
    to: adminEmail,

    subject:
      `New PawMart Adoption Enquiry: ${enquiry.petName} (${reference})`,

    text: `
NEW PAWMART ADOPTION ENQUIRY

Reference: ${reference}

PET DETAILS
Pet: ${enquiry.petName}
Breed: ${enquiry.petBreed || "Not specified"}
Type: ${enquiry.petType || "Pet"}
Age: ${enquiry.petAge || "Not specified"}
Gender: ${enquiry.petGender || "Not specified"}
Location: ${enquiry.petLocation || "Not specified"}

APPLICANT DETAILS
Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}

LIVING SITUATION
${enquiry.livingSituation}

APPLICANT MESSAGE
${enquiry.message}

Status: New

Review this enquiry in the PawMart admin dashboard:
${dashboardUrl}
    `.trim(),

    html: `
      <div style="
        font-family: Arial, Helvetica, sans-serif;
        max-width: 680px;
        margin: 20px auto;
        border: 1px solid #e9e5f5;
        border-radius: 16px;
        overflow: hidden;
        color: #29253b;
      ">
        <div style="
          padding: 26px;
          background: #29233f;
          color: #ffffff;
        ">
          <p style="
            margin: 0 0 8px;
            color: #c9bcff;
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1.5px;
          ">
            PAWMART ADMINISTRATION
          </p>

          <h1 style="margin: 0; font-size: 25px;">
            New Adoption Enquiry 🐾
          </h1>

          <p style="
            margin: 12px 0 0;
            color: #ded9ed;
            font-size: 14px;
          ">
            A new applicant has submitted an adoption enquiry.
          </p>
        </div>

        <div style="padding: 26px;">
          <div style="
            padding: 16px;
            margin-bottom: 24px;
            background: #fff5df;
            border: 1px solid #f7e4b7;
            border-radius: 10px;
          ">
            <strong style="color: #996b17;">
              Status: NEW
            </strong>

            <p style="
              margin: 8px 0 0;
              font-size: 13px;
              color: #705d38;
            ">
              Reference: <strong>${reference}</strong>
            </p>
          </div>

          <h2 style="font-size: 18px;">Pet details</h2>

          <table style="
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          ">
            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Pet name
              </td>
              <td style="padding: 10px 0; font-weight: bold;">
                ${petName}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Breed
              </td>
              <td style="padding: 10px 0;">
                ${petBreed}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Type
              </td>
              <td style="padding: 10px 0;">
                ${petType}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Age
              </td>
              <td style="padding: 10px 0;">
                ${petAge}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Gender
              </td>
              <td style="padding: 10px 0;">
                ${petGender}
              </td>
            </tr>

            <tr>
              <td style="padding: 10px 0; color: #777087;">
                Location
              </td>
              <td style="padding: 10px 0;">
                ${petLocation}
              </td>
            </tr>
          </table>

          <hr style="
            border: 0;
            border-top: 1px solid #eae7f1;
            margin: 24px 0;
          " />

          <h2 style="font-size: 18px;">
            Applicant details
          </h2>

          <p style="font-size: 13px; line-height: 1.9;">
            <strong>Name:</strong> ${applicantName}<br />
            <strong>Email:</strong> ${applicantEmail}<br />
            <strong>Phone:</strong> ${applicantPhone}
          </p>

          <h3 style="font-size: 14px;">
            Living situation
          </h3>

          <div style="
            padding: 14px;
            background: #f8f7fc;
            border: 1px solid #ece8f5;
            border-radius: 9px;
            font-size: 13px;
            line-height: 1.8;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
          ">${livingSituation}</div>

          <h3 style="
            font-size: 14px;
            margin-top: 20px;
          ">
            Applicant's message
          </h3>

          <div style="
            padding: 14px;
            background: #f8f7fc;
            border: 1px solid #ece8f5;
            border-radius: 9px;
            font-size: 13px;
            line-height: 1.8;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
          ">${applicantMessage}</div>

          <div style="margin-top: 28px;">
            <a
              href="${safeDashboardUrl}"
              style="
                display: inline-block;
                padding: 13px 20px;
                border-radius: 9px;
                background: #7356d8;
                color: #ffffff;
                text-decoration: none;
                font-size: 13px;
                font-weight: bold;
              "
            >
              Open Adoption Dashboard
            </a>
          </div>

          <p style="
            margin-top: 28px;
            font-size: 11px;
            color: #89869b;
            line-height: 1.7;
          ">
            Review this enquiry in PawMart. This notification does
            not automatically contact an animal shelter.
          </p>
        </div>
      </div>
    `,
  });
}

// ==================================================
// SEND BOTH EMAILS
// A notification failure must not undo the database save.
// ==================================================

async function sendEnquiryEmails(enquiry, reference) {
  const [applicantResult, adminResult] = await Promise.all([
    sendApplicantConfirmation(enquiry, reference),
    sendAdminNotification(enquiry, reference),
  ]);

  if (!applicantResult.sent) {
    console.error(
      "[PawMart Email] Applicant confirmation was not sent:",
      applicantResult.reason
    );
  }

  if (!adminResult.sent) {
    console.error(
      "[PawMart Email] Admin notification was not sent:",
      adminResult.reason
    );
  }

  return {
    applicant: applicantResult.sent ? "sent" : "failed",
    admin: adminResult.sent ? "sent" : "failed",
  };
}

// ==================================================
// ADMIN AUTHENTICATION
// ==================================================

async function authenticateAdmin(req, res, next) {
  try {
    const token = req.cookies?.pawMartToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access the admin dashboard.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (String(user.role || "").toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrator access is required.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Your session is invalid or expired. Please log in again.",
    });
  }
}

// ==================================================
// SUBMIT ADOPTION ENQUIRY
// POST /api/adoption/enquiries
// ==================================================

router.post("/enquiries", async (req, res) => {
  try {
    const {
      petId,
      petName,
      petBreed,
      petType,
      petAge,
      petGender,
      petLocation,
      name,
      email,
      phone,
      livingSituation,
      message,
    } = req.body;

    const requiredFields = {
      petId,
      petName,
      name,
      email,
      phone,
      livingSituation,
      message,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        });
      }
    }

    if (petId.length > 100 || petName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Pet information is too long.",
      });
    }

    if (name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 80 characters.",
      });
    }

    if (
      email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (phone.trim().length > 25) {
      return res.status(400).json({
        success: false,
        message: "Phone number cannot exceed 25 characters.",
      });
    }

    if (livingSituation.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Living situation cannot exceed 1000 characters.",
      });
    }

    if (message.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 3000 characters.",
      });
    }

    const allowedPetTypes = ["Dog", "Cat", "Other"];

    // Save the enquiry first.
    const enquiry = await AdoptionEnquiry.create({
      petId: petId.trim(),
      petName: petName.trim(),

      petBreed:
        typeof petBreed === "string" ? petBreed.trim() : "",

      petType: allowedPetTypes.includes(petType)
        ? petType
        : "Other",

      petAge:
        typeof petAge === "string" ? petAge.trim() : "",

      petGender:
        typeof petGender === "string" ? petGender.trim() : "",

      petLocation:
        typeof petLocation === "string"
          ? petLocation.trim()
          : "",

      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      livingSituation: livingSituation.trim(),
      message: message.trim(),
      status: "New",
    });

    const reference =
      `AD-${enquiry._id.toString().slice(-8).toUpperCase()}`;

    // Attempt both emails independently.
    const emailNotifications = await sendEnquiryEmails(
      enquiry,
      reference
    );

    const bothEmailsSent =
      emailNotifications.applicant === "sent" &&
      emailNotifications.admin === "sent";

    const messageText = bothEmailsSent
      ? "Your adoption enquiry was saved successfully. Notification emails were accepted by the email server."
      : "Your adoption enquiry was saved successfully, but one or more emails could not be confirmed as accepted. Please check the server logs.";

    return res.status(201).json({
      success: true,
      message: messageText,
      enquiryId: enquiry._id,
      reference,
      emailNotifications,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Please check the enquiry details and try again.",
      });
    }

    console.error(
      "[PawMart] Adoption enquiry error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit the adoption enquiry.",
    });
  }
});

// ==================================================
// ADMIN: GET ENQUIRIES
// GET /api/adoption/enquiries
// ==================================================

router.get("/enquiries", authenticateAdmin, async (req, res) => {
  try {
    const page = Math.max(
      1,
      Number.parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20)
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim().slice(0, 150)
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "All";

    if (status !== "All" && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry status.",
      });
    }

    const filter = {};

    if (status !== "All") {
      filter.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { petName: searchRegex },
        { petBreed: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { petLocation: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [
      enquiries,
      filteredTotal,
      total,
      newCount,
      contactedCount,
      closedCount,
    ] = await Promise.all([
      AdoptionEnquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      AdoptionEnquiry.countDocuments(filter),
      AdoptionEnquiry.countDocuments({}),
      AdoptionEnquiry.countDocuments({ status: "New" }),
      AdoptionEnquiry.countDocuments({ status: "Contacted" }),
      AdoptionEnquiry.countDocuments({ status: "Closed" }),
    ]);

    res.set("Cache-Control", "no-store");

    return res.json({
      success: true,
      enquiries,
      total: filteredTotal,
      page,
      limit,
      pages: Math.ceil(filteredTotal / limit),
      stats: {
        total,
        new: newCount,
        contacted: contactedCount,
        closed: closedCount,
      },
    });
  } catch (error) {
    console.error(
      "[PawMart] Admin adoption dashboard error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load adoption enquiries.",
    });
  }
});

// ==================================================
// ADMIN: UPDATE ENQUIRY STATUS
// PATCH /api/adoption/enquiries/:id/status
// ==================================================

router.patch(
  "/enquiries/:id/status",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid enquiry ID.",
        });
      }

      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be New, Contacted, or Closed.",
        });
      }

      const enquiry = await AdoptionEnquiry.findByIdAndUpdate(
        id,
        { $set: { status } },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: "Adoption enquiry not found.",
        });
      }

      return res.json({
        success: true,
        message: "Enquiry status updated successfully.",
        enquiry,
      });
    } catch (error) {
      console.error(
        "[PawMart] Update adoption status error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to update the enquiry status.",
      });
    }
  }
);

module.exports = router;