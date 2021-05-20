'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Article extends Model {}
  Article.init({
    'title': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'createdDate': {
      type: DataTypes.DATE,
      allowNull: false,
    },
    'announce': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'picture': {
      type: DataTypes.TEXT,
    },
    'fullText': {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
  });

  return Article;
};
