const { v4 } = require('uuid');
const { User, UserInfo } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ValidationError, UniqueConstraintError } = require('sequelize');

/**
 * create user account
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.sign = (req, res, next) => {

    if (req.body.mail === undefined || req.body.password === undefined || req.body.username === undefined || req.body.firstname === undefined || req.body.lastname === undefined) {
        const message = "Toutes les informations n'ont pas été envoyées.";
        return res.status(400).json({ message });
    } else if (req.body.password !== "" && req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)) {

        User.findOne({where: {email: req.body.mail}})
            .then(u => {
                if (u !== null) {
                    const message = "Un compte est deja lié à cet email.";
                    return res.status(401).json({ message });
                }

                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const userId = v4();
                        const user = new User({
                            id: userId,
                            email: req.body.mail,
                            password: hash,
                            projects: ""
                        });
                        user.save()
                            .then(() => {
                                const infoId = v4();
                                const userInfo = new UserInfo({
                                    id: infoId,
                                    userId: userId,
                                    username: req.body.username,
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname
                                });
                                userInfo.save()
                                    .then(() => {
                                        const message = "Utilisateur bien créé.";
                                        res.status(201).json({ message });
                                    })
                                    .catch(error => {
                                        if (error instanceof ValidationError) {
                                            User.findOne({where: {email: req.body.mail}})
                                                .then(user => {
                                                    if (user === null) {
                                                        return res.status(400).json({message: error.message, data: error}); 
                                                    }

                                                    User.destroy({where: { email: req.body.mail }})
                                                        .then(() => {
                                                            return res.status(400).json({message: error.message, data: error}); 
                                                        })
                                                        .catch(error => res.status(500).json({ message: error }));
                                                        
                                                })
                                                .catch(error => res.status(500).json({ message: error }));
                                        }
                                        if (error instanceof UniqueConstraintError) {
                                            User.findOne({where: {email: req.body.mail}})
                                                .then(user => {
                                                    if (user === null) {
                                                        return res.status(400).json({message: error.message, data: error}); 
                                                    }

                                                    User.destroy({where: { email: req.body.mail }})
                                                        .then(() => {
                                                            return res.status(400).json({message: error.message, data: error}); 
                                                        })
                                                        .catch(error => res.status(500).json({ message: error }));
                                                        
                                                })
                                                .catch(error => res.status(500).json({ message: error }));
                                        }

                                        User.findOne({where: {email: req.body.mail}})
                                                .then(user => {
                                                    if (user === null) {
                                                        res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur.", error });
                                                    }

                                                    User.destroy({where: { email: req.body.mail }})
                                                        .then(() => {
                                                            res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur.", error });
                                                        })
                                                        .catch(error => res.status(500).json({ message: error }));
                                                        
                                                })
                                                .catch(error => res.status(500).json({ message: error }));
                                    });
                            })
                            .catch(error => {
                                if (error instanceof ValidationError) {
                                    return res.status(400).json({message: error.message, data: error}); 
                                }
                                if (error instanceof UniqueConstraintError) {
                                    return res.status(400).json({message: error.message, data: error});
                                }
                                res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur.", error });
                            });
                    })
                    .catch(error => res.status(500).json({ message: error }));
                })
                .catch(error => res.status(500).json({ message: error }));

    } else {
        const message = "Les informations sont incorrectes ou incomplètes.";
        res.status(400).json({ message });
    }

};

/**
 * log one user
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.log = (req, res, next) => {

    if (req.body.mail === undefined || req.body.password === undefined) {
        const message = "Toutes les informations n'ont pas été envoyées.";
        return res.status(400).json({ message });
    } else if (
        req.body.password !== "" && req.body.mail !== "" &&
        req.body.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)  &&
        req.body.mail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i)
    ) {
        User.findOne({ where: {email: req.body.mail} })
            .then(user => {
                if (user === null) {
                    const message = "Aucun utilisateur trouvé.";
                    return res.status(404).json({ message });
                }
                
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            const message = "Le mot de passe est incorrect.";
                            return res.status(401).json({ message });
                        }

                        res.status(200).json({
                            userId: user.id,
                            token: jwt.sign(
                                {userId: user.id},
                                '' + process.env.REACT_APP_JWT_PRIVATE_KEY + '',
                                { expiresIn: '24h' }
                            )
                        })
                    })
                    .catch(error => res.status(500).json({ message: error }));
            })
            .catch(error => res.status(500).json({ message: error }));

    } else {
        const message = 'Les informations sont incorrectes ou incomplètes.';
        res.status(400).json({ message });
    }

};

exports.getUserInfo = (req, res, next) => {
    let data;

    User.findOne({ where: { id: req.params.id } })
        .then(user => {
            if (user === null) {
                const message = "Aucun utilisateur trouvé.";
                return res.status(404).json({ message });
            }
            
            UserInfo.findOne({ where: { userId: req.params.id } })
            .then(userInfo => {
                if (userInfo === null) {
                        const message = "Aucun utilisateur trouvé.";
                        return res.status(404).json({ message });
                    }

                    data = {
                        id: user.id,
                        username: userInfo.username,
                        firstname: userInfo.firstname,
                        lastname: userInfo.lastname,
                    };

                    const message = "Un utilisateur à bien été trouvé.";
                    res.status(200).json({ message, data });
                })
        })
        .catch(err => res.status(500).json({ message: err }))
};

exports.getHomeUserInfo = (req, res, next) => {
    let data;

    User.findOne({ where: { id: req.params.id } })
        .then(user => {
            if (user === null) {
                const message = "Aucun utilisateur trouvé.";
                return res.status(404).json({ message });
            }
            
            UserInfo.findOne({ where: { userId: req.params.id } })
            .then(userInfo => {
                if (userInfo === null) {
                        const message = "Aucun utilisateur trouvé.";
                        return res.status(404).json({ message });
                    }

                    data = {
                        id: user.id,
                        projects: user.projects,
                        username: userInfo.username
                    };

                    const message = "Un utilisateur à bien été trouvé.";
                    res.status(200).json({ message, data });
                })
        })
        .catch(err => res.status(500).json({ message: err }))
};