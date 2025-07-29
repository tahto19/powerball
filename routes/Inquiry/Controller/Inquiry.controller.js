import { emailSender } from "../../../util/util.js";
import "dotenv/config";

export const InquiryController = async (req, res) => {
  try {
    const { email, name, mobileNumber, message } = req.body;
    await emailSender({
      from: null,
      to: process.env.INQUIRYEMAIL,
      subject: "New Inquiry",
      html: `
              You’ve received a new enquiry through the scratchit website contact form.
              <br /><br />
              Here are the details:
              <br /><br />
              <strong>Name:</strong> ${name}<br />
              <strong>Email:</strong> ${email}<br />
              <strong>Phone:</strong> ${mobileNumber}<br />
              <strong>Message:</strong> ${message}<br /><br />
              Please respond to the customer as soon as possible.
              <br /><br />
              Thank you
              `,
    });
    res.send({
      result: "success",
      message:
        "Thank you! Your enquiry has been received. We'll get back to you shortly.",
    });
  } catch (err) {
    console.log(err, "here");
    res.send({
      result: "false",
      message:
        "Something went wrong while sending your message. Please try again in a few moments.",
    });
  }
};
