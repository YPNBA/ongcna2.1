const mongoose = require('mongoose');

const stagiaireSchema = new mongoose.Schema({
    nom : {type: String, require: true},
    prenom : {type: String, require: true},
    email : {type: String, require: true},
    age : {type: Number, require: true},
    telephone: {type: Number, require: true},
    quartier: {type: String, require: true},
    ecole: {type: String, require: true},
    typeStage: {type: String, require: true},
    photo: String,
});

module.exports =  mongoose.model('Stagiaire', stagiaireSchema);


