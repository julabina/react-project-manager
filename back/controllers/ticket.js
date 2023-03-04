const { v4 } = require('uuid');
const { Ticket, UserInfo } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');

exports.create = (req, res, next) => {

    if (req.body.title === undefined || req.body.description === undefined || req.body.projectId === undefined || req.body.creator === undefined) {
        const message = "Toutes les informations n'ont pas été envoyées.";
        return res.status(400).json({ message });
    } else {

        UserInfo.findOne({where: {userId: req.body.creator}})
            .then(userInfo => {
                    if (userInfo === null) {
                        const message = 'Aucun utilisateur trouvé.';
                        return res.status(404).json({ message });
                    }
                
                    const ticket = new Ticket({
                    id: v4(),
                    projectId: req.body.projectId,
                    title: req.body.title,
                    description: req.body.description,
                    creator: req.body.creator,
                    creatorName: userInfo.username,
                    status: "pending",
                    usersWorking: ['']
                });
                
                ticket.save()
                .then(() => {
                    const message = "Ticket bien créé.";
                    res.status(201).json({ message });
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
            
    }

};

exports.getAll = (req, res, next) => {

    Ticket.findAll({where: { projectId: req.params.id }})
        .then(tickets => {
            if (tickets === null || tickets.length === 0) {
                const message = 'Aucun tickets trouvés.';
                return res.status(404).json({ message });
            }

            const message = "Des tickets ont bien été trouvés.";
            res.status(200).json({ message, data: tickets });
        })
        .catch(error => res.status(500).json({ message: error }));

};

exports.changeStatus = (req, res, next) => {

    Ticket.findOne({where: { id: req.params.id }})
        .then(ticket => {
            if (ticket === null) {
                const message = "Aucun ticket trouvé.";
                return res.status(404).json({ message });
            }

            if (req.body.status !== undefined) {   
                ticket.status = req.body.status;
                ticket.save()
                    .then(() => {
                        const message = "Ticket bien modifié";
                        res.status(201).json({ message });
                    })
                    .catch(error => res.status(500).json({ message: error }));
            } else {
                const message = "Aucune valeur envoyée.";
                res.status(401).json({ message });
            }
        })
        .catch(error => res.status(500).json({ message: error }));

};