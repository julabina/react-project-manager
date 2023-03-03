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
                    colaborators: [""]
                });
                project.save()
                    .then(() => {

                        let userProjects = user.projects;

                        if (userProjects.length === 1 && userProjects[0] === "") {
                            userProjects = [id];
                        } else {
                            userProjects.push(id);
                        }

                        user.projects = userProjects;

                        user.save()
                            .then(() => {
                                const message = "Projet bien créé.";
                                res.status(201).json({ message, id });
                            })
                            .catch(error => { 
                                project.destroy({where: { id: id }})
                                    .then(() => {
                                        res.status(500).json({ message: error });
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
    }
};

exports.getProject = (req, res, next) => {
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

exports.getProjects = (req, res, next) => {

    if (req.body.projectsId === undefined) {
        const message = "Toutes les informations n'ont pas été envoyées.";
        return res.status(400).json({ message });
    } else {
  
        Project.findAll({ where: {id: req.body.projectsId} })
        .then(projects => {
            
            if (projects.length === 0) {
                const message = "Aucun projets trouvés.";
                return res.status(404).json({ message });
            }
            
            let message = "";
            
            if (projects.length === 1) {
                message = 'Un projet a bien été trouvé.'
            } else {
                message = 'Des projets ont bien été trouvés.'
            }
            
            res.status(200).json({message, data: projects})
        })
        .catch(error => res.status(500).json({ message: error }));

    }

};

exports.addCollab = (req, res, next) => {

    if (req.body.projectId === undefined || req.body.collabMail === undefined) {
        const message = "Toutes les informations n'ont pas été envoyées.";
        return res.status(400).json({ message });
    } else {

        Project.findOne({where: { id: req.body.projectId }})
            .then(project => {
                if (project === null) {
                    const message = "Aucun projet trouvé.";
                    return res.status(404).json({ message });
                }

                User.findOne({where: { email: req.body.collabMail }})
                    .then(user => {
                        if (user === null) {
                            const message = "Aucun utilisateur ne correspond à cet email.";
                            return res.status(404).json({ message });
                        }

                        if (project.creator === user.id) {
                            const message = "Impossible d'ajouter le créateur en tant que collaborateur.";
                            return res.status(401).json({ message });
                        }

                        const userCollabId = user.id;

                        let collabs = project.colaborators;
                        

                        if (collabs.length === 1 && collabs[0] === "") {
                            collabs = [userCollabId];
                        } else if (collabs.includes(userCollabId)) {
                            const message = "L'utilisateur est deja assigné au projet.";
                            return res.status(401).json({ message });
                        } else {
                            collabs.push(userCollabId);
                        }

                        project.colaborators = collabs;
                        
                        project.save()
                            .then(() => {

                                let userProjects = user.projects;

                                if (userProjects.length === 1 && userProjects[0] === "") {
                                    userProjects = [req.body.projectId];
                                } else {
                                    if (!userProjects.includes(req.body.projectId)) {
                                        userProjects.push(req.body.projectId);
                                    }
                                }
        
                                user.projects = userProjects;
        
                                user.save()
                                    .then(() => {
                                        const message = "Collaborateur ajouté.";
                                        res.status(200).json({ message });
                                    })
                                    .catch(error => {

                                        let collabs2 = project.colaborators;
                        
                                        if (collabs2.includes(userCollabId)) {
                                            collabs2 = collabs2.filter(el => {
                                                return el !== userCollabId
                                            })
                                        }

                                        project.colaborators = collabs2;
                                        
                                        project.save()
                                            .then(() => {
                                                if (error instanceof ValidationError) {
                                                    return res.status(400).json({message: error.message, data: error}); 
                                                }
                                                if (error instanceof UniqueConstraintError) {
                                                    return res.status(400).json({message: error.message, data: error});
                                                }
                                                res.status(500).json({ message: "Une erreur est survenue.", error });
                                            })
                                            .catch(error => {
                                                if (error instanceof ValidationError) {
                                                    return res.status(400).json({message: error.message, data: error}); 
                                                }
                                                if (error instanceof UniqueConstraintError) {
                                                    return res.status(400).json({message: error.message, data: error});
                                                }
                                                res.status(500).json({ message: "Une erreur est survenue.", error });
                                            });
                                    });

                            })
                            .catch(error => {
                                if (error instanceof ValidationError) {
                                    return res.status(400).json({message: error.message, data: error}); 
                                }
                                if (error instanceof UniqueConstraintError) {
                                    return res.status(400).json({message: error.message, data: error});
                                }
                                res.status(500).json({ message: "Une erreur est survenue.", error });
                            });
                        
                    })
                    .catch(error => res.status(500).json({ message: error }));

            })
            .catch(error => res.status(500).json({ message: error }));
        
    }
    
};

exports.removeCollab = (req, res, next) => {

    if (req.body.projectId === undefined) {
        const message = "Le projet n'a pas été renseigné.";
        return res.status(400).json({ message });
    } else {
        
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                if (user === null) {
                    const message = "Aucun utilisateur trouvé.";
                    return res.status(404).json({ message });
                }

                Project.findOne({ where: { id: req.body.projectId } })
                    .then(project => {
                        if (project === null) {
                            const message = "Aucun projet trouvé.";
                            return res.status(404).json({ message });
                        }
                        if (project.creator === req.params.id) {
                            const message = "Impossible de supprimer le créateur.";
                            return res.status(403).json({ message });
                        }
                        
                        const projectCollabs = project.colaborators;
                        const projectCollabsFiltered = projectCollabs.filter(el => {
                            return el !== req.params.id
                        });

                        project.colaborators = projectCollabsFiltered;

                        project.save()
                            .then(() => {
                                const userProject = user.projects;
                                const userProjectFiltered = userProject.filter(el => {
                                    return el !== req.body.projectId;
                                });

                                user.projects = userProjectFiltered;

                                user.save()
                                    .then(() => {
                                        const message = "Collaborateur bien retiré du projet.";
                                        res.status(200).json({ message });
                                    })
                            })
                    })
                    .catch(error => res.status(500).json({ message: error }));
            })
            .catch(error => res.status(500).json({ message: error }));

    }

};