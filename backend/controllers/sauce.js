const Sauce = require('../models/Sauce'), fs = require('fs');

//créer une nouvelle sauce
exports.createSauce =  (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce)
    //suppression de l'id envoyé par le front
    delete sauceObject._id;
    //instance de l'objet sauce ajoutée
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userliked: [],
        userDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ? {...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : {...req.body};
    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
     .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
     .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const fileName = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${fileName}`, () => {
            Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));  
};

exports.getAllSauces = (req, res, next)=> {
    Sauce.find()
     .then(sauces => res.status(200).json(sauces))
     .catch(error => res.status(400).json({error}));
};

exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({error}));
};

exports.likeSauce = (req, res, next) => {
    Sauce.updateOne({_id: req.params.id}, {likes: + 1})
    .then(() => res.status(201).json({ message: 'Un nouveau like a été ajouté au produit !'}))
    .catch(error => res.status(409).json({error}));
};






