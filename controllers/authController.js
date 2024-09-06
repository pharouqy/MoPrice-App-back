import User from "../models/user.js";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { hash as _hash } from "bcrypt";

dotenv.config();

export function forgotPassword(req, res) {
  const { email } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé !" });
      }

      // Générer un token unique pour la réinitialisation du mot de passe
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHashed = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Stocker le token haché et la date d'expiration dans la base de données
      user.resetPasswordToken = resetTokenHashed;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
      user.save();

      // Créer un lien de réinitialisation
      const resetUrl = `${process.env.FRONTEND_URL}reset-password/${resetToken}`;

      // Configurer nodemailer pour envoyer l'email
      const transporter = nodemailer.createTransport({
        service: "gmail", // Par exemple, sinon configurez le service que vous utilisez
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        text: `Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erreur lors de l'envoi de l'email:", error);
          return res.status(500).json({
            message: "Erreur interne lors de l'envoi de l'email",
            error: error.message,
          });
        }
        res.status(200).json({ message: "Email de réinitialisation envoyé !" });
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      res.status(500).json({
        message: "Erreur interne lors de la demande de réinitialisation",
        error: error.message || error,
      });
    });
}

export function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  // Hacher le token reçu
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Rechercher l'utilisateur avec le token haché et vérifier la date d'expiration
  User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Token invalide ou expiré" });
      }

      // Hacher le nouveau mot de passe
      _hash(password, 10)
        .then((hashedPassword) => {
          // Mettre à jour le mot de passe et supprimer les champs de réinitialisation
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          // Sauvegarder l'utilisateur mis à jour
          user
            .save()
            .then(() =>
              res
                .status(200)
                .json({ message: "Mot de passe réinitialisé avec succès !" })
            )
            .catch((error) => {
              console.error(
                "Erreur lors de la sauvegarde de l'utilisateur:",
                error
              );
              res
                .status(500)
                .json({
                  message:
                    "Erreur interne lors de la sauvegarde de l'utilisateur",
                  error: error.message || error,
                });
            });
        })
        .catch((error) => {
          console.error("Erreur lors du hachage du mot de passe:", error);
          res
            .status(500)
            .json({
              message: "Erreur interne lors du hachage du mot de passe",
              error: error.message || error,
            });
        });
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      res
        .status(500)
        .json({
          message: "Erreur interne lors de la réinitialisation du mot de passe",
          error: error.message || error,
        });
    });
}
