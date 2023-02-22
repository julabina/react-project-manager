const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/user');
const UserInfoModel = require('../models/userInfo');
const ProjectModel = require('../models/project');
const TicketModel = require('../models/ticket');
const CategoryModel = require('../models/category');

const sequelize = new Sequelize(
    'react_project_manager',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        port: 3306,
        dialectOptions: {
            timezone: 'Etc/GMT-2',
            socketPath: '/opt/lampp/var/mysql/mysql.sock'
            /* for production 
            
            socketPath: '/var/run/mysqld/mysqld.sock',
           cachingRsaPublicKey: '/var/lib/mysql/public_key.pem', */
        },
        logging: false
    }
);

const User = UserModel(sequelize, DataTypes);
const UserInfo = UserInfoModel(sequelize, DataTypes);
const Project = ProjectModel(sequelize, DataTypes);
const Ticket = TicketModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);

module.exports = {  
    User, UserInfo, Project, Ticket, Category
};