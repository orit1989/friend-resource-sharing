module.exports = function (sequelize, DataTypes) {
    var Resource = sequelize.define("Resource", {
        topic: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            validate: {
                len: [1]
            }
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    

    Resource.associate = function (models) {
        Resource.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
        // SharedResources = sequelize.define('SharedResources', {});
        // Resource.belongsToMany(models.User, {
        //     through: SharedResources
        // });
        // models.User.belongsToMany(Resource, {
        //     through: SharedResources
        // });


        Resource.belongsToMany(models.User, {
            through: "Users_Resources"
        });
    };



    return Resource;
};