'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Category extends Model {}
  Category.init({
    'title': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
  });

  return Category;
};
