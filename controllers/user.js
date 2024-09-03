import User from "../models/user.js";
import { compare, hash as _hash } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function login(req, res) {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { email: req.body.email, userId: user._id },
              process.env.SECRET_TOKEN,
              {
                expiresIn: process.env.EXPIRE_TIME_TOKEN,
              }
            ),
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la comparaison des mots de passe:",
            error
          );
          res.status(500).json({
            message: "Erreur interne lors de la comparaison des mots de passe",
            error: error.message || error,
          });
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche de l'utilisateur:", error);
      res.status(500).json({
        message: "Erreur interne lors de la recherche de l'utilisateur",
        error: error.message || error,
      });
    });
}

export function register(req, res) {
  _hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        ...req.body,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => {
          console.error("Erreur lors de la création de l'utilisateur:", error);
          res.status(400).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message || error,
          });
        });
    })
    .catch((error) => {
      console.error("Erreur lors du hachage du mot de passe:", error);
      res.status(500).json({
        message: "Erreur interne lors du hachage du mot de passe",
        error: error.message || error,
      });
    });
}

export function logout(req, res) {
  res.status(200).json({ message: "Déconnexion réussie" });
}

export function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé !" });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      res.status(500).json({
        message: "Erreur interne lors de la récupération de l'utilisateur",
        error: error.message || error,
      });
    });
}

export function updateUser(req, res) {
  const updateData = req.body;
  if (updateData.password) {
    _hash(updateData.password, 10)
      .then((hash) => {
        updateData.password = hash;
        User.findByIdAndUpdate(req.params.id, updateData, { new: true })
          .then((user) => {
            if (!user) {
              return res
                .status(404)
                .json({ message: "Utilisateur non trouvé !" });
            }
            res.status(200).json({ message: "Utilisateur mis à jour !" });
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la mise à jour de l'utilisateur:",
              error
            );
            res.status(500).json({
              message: "Erreur interne lors de la mise à jour de l'utilisateur",
              error: error.message || error,
            });
          });
      })
      .catch((error) => {
        console.error("Erreur lors du hachage du mot de passe:", error);
        res.status(500).json({
          message: "Erreur interne lors du hachage du mot de passe",
          error: error.message || error,
        });
      });
  } else {
    User.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé !" });
        }
        res.status(200).json({ message: "Utilisateur mis à jour !" });
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        res.status(500).json({
          message: "Erreur interne lors de la mise à jour de l'utilisateur",
          error: error.message || error,
        });
      });
  }
}

export function deleteUser(req, res) {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé !" });
      }
      res.status(200).json({ message: "Utilisateur supprimé !" });
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      res.status(500).json({
        message: "Erreur interne lors de la suppression de l'utilisateur",
        error: error.message || error,
      });
    });
}
