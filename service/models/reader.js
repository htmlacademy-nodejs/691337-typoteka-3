'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Reader extends Model {}
  Reader.init({
    'firstname': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'lastname': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'email': {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    'password': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'avatar': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'role': {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Reader;
};
