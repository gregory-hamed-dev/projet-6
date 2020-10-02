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
    //ajout de la sauce à la base de données 
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({error}));
};
// méthode pour modifier une sauce déjà postée par l'utilisateur
exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ? {...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : {...req.body};
    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
     .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
     .catch(error => res.status(400).json({error}));
};
// méthode pour effacer la sauce de la base de données 
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
// méthode pour obtenir l'affichage de toutes les sauces 
exports.getAllSauces = (req, res, next)=> {
    Sauce.find()
     .then(sauces => res.status(200).json(sauces))
     .catch(error => res.status(400).json({error}));
};
// méthode pour obtenir plus de détails sur une sauce en particulier 
exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({error}));
};
// méthode pour aimer une sauce ou être un hater
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {
        //si l'utilisateur aime la sauce
        case 1:
            Sauce.updateOne({_id: req.params.id}, { $addToSet: { usersLiked: req.body.userId }, $inc: { likes: 1 } })
                .then(() => res.status(201).json({message: 'L\'utilisateur aime la sauce!'}))
                .catch(error => res.status(404).json({ error: error}))
                console.log('L\'utilisateur aime la sauce!');
            break;
        // si l'utilisateur n'aime pas la sauce
        case -1:
            Sauce.updateOne({_id: req.params.id}, { $addToSet: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } })
                .then(sauce => res.status(201).json({message: 'L \'utilisateur n\'aime pas la sauce !'}))
                .catch(error => res.status(404).json({error}))
                console.log('L\'utilisateur n\'aime pas la sauce !');
            break;
        // si l'utilisateur annule son like ou son dislike 
         case 0:
            Sauce.findOne({_id: req.params.id})
                .then(sauce => {
                    // Si l'utilisateur annule son like 
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
                            .then(() => res.status(201).json({ message: 'L\'utilisateur n\'aime plus la sauce!'}))
                            .catch(error => res.status(404).json({error}))
                            console.log("L'utilisateur a annulé son j'aime");
                    //si l'utilisateur annule son dislike 
                    } else if (sauce.usersDisliked.includes(req.body.userId)){
                        Sauce.updateOne({ _id: req.params.id },{ $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then(() => res.status(200).json({message: 'L\'utilisateur n\'est plus un hater Hourra !'}))
                            .catch((error) => res.status(404).json({error}))
                            console.log("L'utilisateur n'est plus un hater! ");
                    } 
                })
                .catch((error) => res.status(404).json({error: error}));
             break;
    }
};
 
