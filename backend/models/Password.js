const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

// critères à respecter pour le mot de passe 

passwordSchema
.is().min(8)                                    // 8 caractères minimum
.is().max(100)                                  // 100 caractères maximum
.has().uppercase()                              // doit contenir des majuscules
.has().lowercase()                              // doit contenir des minuscules
.has().digits()                                // doit contenir des nombres
.has().not().spaces()                           // ne doit pas contenir d'espaces 
.is().not().oneOf(['Passw0rd', 'Password123']); // passwords blacklistés 

module.exports = passwordSchema;