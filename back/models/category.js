module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
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
                notEmpty: { msg: "Le nom de la categorie ne doit pas être vide." },
                len: { args: [2, 25], msg: "Le nom de la categorie doit etre compris entre 2 et 25 caractères." },
                is: {args: /^[\wé èà\-]*$/i, msg: "le nom de la categorie ne doit contenir que des lettres"}
            }
        },
        project: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    });
};