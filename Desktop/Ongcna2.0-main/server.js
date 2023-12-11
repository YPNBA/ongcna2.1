const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const bcrypt = require("bcrypt");

const Stagiaire = require('./models/Stagiaire');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT ||  30001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const uri = 'mongodb://127.0.0.1:27017/ongcnadb';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);  
});

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Création de l'administrateur par défaut



app.get('/', (req, res) => {
  res.render('login', { req });
});

app.get('index', (req, res) => {
  
  res.render('index');
});

// Routuez avec le reste de votre code
// Vérification et création de l'administrateur
const adminUsername = "admin";
const adminPassword = "azertyuiop";

Admin.findOne({ username: adminUsername })
  .then(existingAdmin => {
    if (!existingAdmin) {
      const admin = new Admin({
        username: adminUsername,
        password: adminPassword
      });

      return admin.save();
    } else {
      console.log('Admin déjà existant.');
      return null;
    }
  })
  .then(savedAdmin => {
    if (savedAdmin) {
      console.log('Admin créé avec succès!');
    }
  })
  .catch(error => {
    console.error(error);
  });


app.get('/index', async (req, res) => {
  try {
    const stagiaires = await Stagiaire.find();
    const groupes = [...new Set(stagiaires.map(stagiaire => stagiaire.typeStage))];
    res.render('index', { groupes, stagiaires });
  } catch (error) {
    res.status(500).render('error', { error: 'Internal Server Error' });

  }
});


app.get("/inscription", (req, res) => {
    res.render('inscription')
})

app.post('/inscription', upload.single('photo'), async (req, res) => {
    try {
      const stagiaire = new Stagiaire({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        age: req.body.age,
        telephone: req.body.telephone,
        quartier: req.body.quartier,
        ecole: req.body.ecole,
        typeStage: req.body.typeStage,
        photo: req.file ? '/uploads/' + req.file.filename : null, // Enregistrez le chemin de l'image
      });
      await stagiaire.save();
      res.redirect('/index');
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  // server.js

// Ajoutez cette route après les autres routes existantes
app.get('/stagiaires/:id', async (req, res) => {
  try {
      const stagiaire = await Stagiaire.findById(req.params.id);
      res.render('details', { stagiaire, capitalizeFirstLetter }); // Passer le stagiaire individuel, pas la liste des stagiaires
  } catch (error) {
      res.status(500).send('Internal Server Error');
  }
});



// Ajoutez cette route après les autres routes existantes
app.post('/stagiaire/:id/modifier', upload.single('photo'), async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);

    // Update stagiaire properties with new values
    stagiaire.nom = req.body.nom;
    stagiaire.prenom = req.body.prenom;
    stagiaire.email = req.body.email;
    stagiaire.date = req.body.dateNaissance;
    stagiaire.telephone = req.body.telephone;
    stagiaire.quartier = req.body.quartier;
    stagiaire.ecole = req.body.ecole;
    stagiaire.typeStage = req.body.typeStage;

    if (req.file) {
      stagiaire.photo = '/uploads/' + req.file.filename;
    }

    await stagiaire.save();
    res.redirect(`/stagiaires/${req.params.id}`); // Redirect to details page after modification
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


// Ajoutez cette route après les autres routes existantes
app.post('/stagiaire/:id/supprimer', async (req, res) => {
  try {
      await Stagiaire.findByIdAndDelete(req.params.id);
      res.redirect('/index'); // Redirigez après la suppression
  } catch (error) {
      res.status(500).send('Internal Server Error');
  }
});


app.post('/', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Find the administrator by username
    const admin = await Admin.findOne({ username });

    if (admin && password === admin.password) {
      // Authentication successful (not recommended for production)
      res.redirect('index');
    } else {
      // Authentication failed
      res.redirect('/?error=1');
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Internal Server Error' });
  }
});

// server.js
// equipes
app.get('/equipes', async (req, res) => {
  try {
    const stagiaires = await Stagiaire.find();
    const groupes = [...new Set(stagiaires.map(stagiaire => stagiaire.typeStage))];
    res.render('equipes', { groupes, stagiaires });
  } catch (error) {
    res.status(500).render('error', { error: 'Internal Server Error' });
  }
});


// server.js
app.get('/recherche', async (req, res) => {
  try {
    const query = req.query.q;
    const stagiaires = await Stagiaire.find({
      $or: [
        { nom: { $regex: query, $options: 'i' } },
        { prenom: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ]
    });

    // Retournez les résultats sous forme de HTML
    const html = generateResultHtml(stagiaires);
    res.json({ html });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fonction pour générer le HTML des résultats de la recherche
function generateResultHtml(stagiaires) {
  let html = '<ul>';
  stagiaires.forEach(stagiaire => {
    html += `<li>
      <a href="/stagiaires/${stagiaire._id}" class="block mb-4 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300">
        <img src="${stagiaire.photo}" alt="${stagiaire.nom} ${stagiaire.prenom}" class="w-16 h-16 object-cover rounded-full mb-2">
        <h3 class="text-xl font-bold">${stagiaire.nom} ${stagiaire.prenom}</h3>
      </a>
    </li>`;
  });
  html += '</ul>';
  return html;
}


// server.js
app.get('/logout', (req, res) => {
  res.redirect('/')
})
// ... (votre code existant)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Gestion générique des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).redirect('/404');
});


  // Lancez votre serveur uniquement après la création de l'administrateur app.listen(PORT, () => {
app.listen(PORT, () => {
    console.log(`Le serveur est actif sur le port ${PORT}...`);
})





