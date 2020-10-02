const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const maskData = require('maskdata');


// option de masquage de l'email dans la base de données
const emailMaskOptions = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 2,
    unmaskedEndCharactersAfterAt: 1,
    maskAtTheRate: false
};

exports.signup = (req, res, next) => {
    //hachage du mot de passe salé 10 fois selon mon goût ^^ 
    bcrypt.hash(req.body.password, 10)
     .then(hash => {
         const user = new User({
             //masquage de l'email
             email: maskData.maskEmail2(req.body.email, emailMaskOptions),
             password: hash
         });
         //sauvegarde de l'utilisateur dans la base de données
         user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
            .catch(error => res.status(400).json({error}));
     })
     .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email, emailMaskOptions)})
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Accès non autorisée !'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe erroné  !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            '59UiBWftCNG2gqz9bBgy1rYQUkOx9Ewg1o8yEJp2AKIVaunSJt',
                            {expiresIn: '1h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};