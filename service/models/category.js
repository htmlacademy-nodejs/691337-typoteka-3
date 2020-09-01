'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Category extends Model {}
  Category.init({
    'category_id': {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    'category_title': {
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
