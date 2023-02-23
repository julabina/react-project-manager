module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserInfo', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: {msg: "L'id ne doit pas etre vide."},
                notNull: {msg: "L'id est une propriétée requise."}
            }
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: "L'id ne doit pas etre vide."},
                notNull: {msg: "L'id est une propriétée requise."}
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Le pseudo ne doit pas être vide." },
                len: { args: [2, 25], msg: "Le pseudo doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[\w éèàêïëîâà\-]*$/i, msg: "le pseudo ne doit contenir que des lettres"}
            }
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Le prénom ne doit pas être vide." },
                len: { args: [2, 25], msg: "Le prénom doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[a-zA-Z éèàêïëîâà\-]*$/i, msg: "le prénom ne doit contenir que des lettres"}
            }
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Le nom ne doit pas être vide." },
                len: { args: [2, 25], msg: "Le nom doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[a-zA-Z éèàêïëîâà\-]*$/i, msg: "le nom ne doit contenir que des lettres"}
            }
        },
    },{
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
};