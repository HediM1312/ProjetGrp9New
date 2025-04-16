const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

// Validation des données
const registerValidation = [
  check("username")
    .notEmpty()
    .withMessage("Le nom d'utilisateur est requis")
    .isLength({ min: 3 })
    .withMessage("Le nom d'utilisateur doit contenir au moins 3 caractères"),
  check("email").isEmail().withMessage("Veuillez entrer un email valide"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
];

const loginValidation = [
  check("email").isEmail().withMessage("Veuillez entrer un email valide"),
  check("password").notEmpty().withMessage("Le mot de passe est requis"),
];

// Routes
router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

module.exports = router;
