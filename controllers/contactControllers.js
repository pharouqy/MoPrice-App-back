import { createTransport } from "nodemailer";

// Fonction pour gérer l'envoi de l'email
export default function sendContactEmail(req, res) {
  const { name, email, message } = req.body;

  // Configuration du transporteur Nodemailer
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Paramètres de l'email
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // L'adresse email où tu veux recevoir les messages
    subject: `Nouveau message de ${name}`,
    text: `Vous avez reçu un message de ${name} (${email}): \n\n${message}`,
  };

  // Envoi de l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send("Une erreur est survenue lors de l'envoi du message.");
    } else {
      console.log("Email envoyé : " + info.response);
      return res.status(200).send("Le message a été envoyé avec succès !");
    }
  });
}
