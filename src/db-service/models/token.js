'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Token extends Model {}
  Token.init({
    'refresh': {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Token;
};
