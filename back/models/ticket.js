module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Ticket', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: {msg: "L'id ne doit pas etre vide."},
                notNull: {msg: "L'id est une propriétée requise."}
            }
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: "Le createur ne doit pas etre vide."},
                notNull: {msg: "Le createur est une propriétée requise."}
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Le titre ne doit pas être vide." },
                len: { args: [2, 25], msg: "Le titre doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[\wé èà\-]*$/i, msg: "le titre ne doit contenir que des lettres"}
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [2, 25], msg: "La description doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[\wé èà\-]*$/im, msg: "la description ne doit contenir que des lettres"}
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: {args: /^[\wé èà\-]*$/i, msg: "le status ne doit contenir que des lettres"}
            }
        },
        categories: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        timestamps: true,
        createdAt: 'created',
        updatedAt: 'updated'
    });
};