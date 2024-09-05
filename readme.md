# mprice-back

## Description

Ce projet est une application backend pour mprice. Il utilise Node.js et Express pour créer une API RESTful, et MongoDB comme base de données.

## Configuration

### Variables d'environnement

Les variables d'environnement suivantes doivent être définies pour que l'application fonctionne correctement. Vous devez créer un fichier `.env` à la racine du projet avec le contenu suivant :

```env
PORT = 3000
MONGODB_URL = 'votre_url_mongodb'
EXPIRE_TIME_TOKEN = "24h"
SECRET_TOKEN = "votre_secret_token"
FRONTEND_URL = "http://localhost:5173/"
EMAIL_USER = "votre_email_user"
EMAIL_PASS = "votre_email_pass"
```

### Dépendances

Le projet utilise les dépendances suivantes :

- `bcrypt`: ^5.1.1
- `cors`: ^2.8.5
- `dotenv`: ^16.4.5
- `express`: ^4.19.2
- `helmet`: ^7.1.0
- `jsonwebtoken`: ^9.0.2
- `mongoose`: ^8.6.0
- `mongoose-unique-validator`: ^5.0.1
- `nodemailer`: ^6.9.15

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/votre-utilisateur/mprice-back.git
cd mprice-back
```

2. Installez les dépendances :

```bash
npm install
```

## Démarrage

Pour démarrer l'application, exécutez la commande suivante :

```bash
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`.

## Scripts

- `test`: Affiche un message d'erreur indiquant qu'aucun test n'est spécifié.
- `start`: Démarre l'application en utilisant `nodemon`.

## Auteur

Younsi Farouk

## Licence

Ce projet est sous licence ISC.

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer, veuillez suivre ces étapes :

1. Fork le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/votre-fonctionnalite`).
3. Committez vos modifications (`git commit -m 'Ajout de la fonctionnalité'`).
4. Poussez la branche (`git push origin feature/votre-fonctionnalite`).
5. Ouvrez une Pull Request.

---

Merci d'utiliser mprice-back !