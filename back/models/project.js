module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Project', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: {msg: "L'id ne doit pas etre vide."},
                notNull: {msg: "L'id est une propriétée requise."}
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Le titre ne doit pas être vide." },
                len: { args: [2, 100], msg: "Le titre doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[\wé èà\-]*$/i, msg: "le titre ne doit contenir que des lettres et des chiffres"}
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: { args: [0, 400], msg: "La description ne doit pas dépasser 400 caractères." },
                is: {args: /^[\wé èà\-,.]*$/im, msg: "la description ne doit pas contenir de caractères spéciaux."}
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
        colaborators: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                return this.getDataValue('colaborators').split(',')
            },
            set(colaborators) {
                this.setDataValue('colaborators', colaborators.join())
            }
        },
    },{
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
};