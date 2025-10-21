import Nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.email",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "kenethgarita@gmail.com",
    pass: "dgyr sttc sfcl nwpn",
  },
});

transporter.verify(() => {
    console.log("Ready to send emails")
})