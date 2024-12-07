
---- Procédure d'installation ----

Aller dans votre dossier désiré pour contenir le projet
executer la commande git clone https://github.com/VincentHoule/ProjetDND.git
npm install

---- Configuration ----
Créer les fichiers .env à partir des exemples. Le seule a modifié c'est le development.env et il faut rentrer
ses informations à sa BD mongoose.

Le fichier tailwind.config.js doit contenir :
/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {},
  },
  plugins: []
}

Pour créer la base de données, le fichier executer le fichier dev_web_3.personnage.json dans 
votre base de donnée mongoose.

url de l'api: https://projet-dnd.netlify.app

## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).


## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm test`

Run all unit-tests with hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Run a single unit-test.

### `npm run test:no-reloading`

Run all unit-tests without hot-reloading.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.


## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`. 
