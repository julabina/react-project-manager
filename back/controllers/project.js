const { v4 } = require("uuid");
const { Project, User } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');

exports.createProject = (req, res, next) => {

    if (req.body.title === undefined || req.body.userId === undefined || req.body.description === undefined) {
        const message = "Toutes les informations n'ont pas été envoyées.";
        return res.status(400).json({ message });
    } else if (req.body.userId !== req.auth.userId) {
        const message = "Permission non accrodée.";
        return res.status(403).json({ message });
    } else {

        User.findOne({where: {id: req.body.userId}})
            .then(user => {
                if (user === null) {
                    const message = "Aucun utilisateur trouvé.";
                    return res.status(404).json({ message });
                }

                const id = v4();
                const project = new Project({
                    id,
                    title: req.body.title,
                    description: req.body.description,
                    creator: req.body.userId,
                    colaborators: ""
                });
                project.save()
                    .then(() => {
                        const message = "Projet bien créé.";
                        res.status(201).json({ message, id });
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
    }
};

exports.getInfos = (req, res, next) => {
    Project.findOne({where: {id: req.params.id}})
        .then(project => {
            if (project === null) {
                const message = "Aucun projet trouvé.";
                return res.status(404).json({ message });
            }

            const message = 'Un projet a bien été trouvé.';
            res.status(200).json({ message, data: project })
        })
        .catch(error => res.status(500).json({ message: error }));
};