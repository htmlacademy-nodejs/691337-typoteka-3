'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Article extends Model {}
  Article.init({
    'article_id': {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    'article_title': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'created_date': {
      type: DataTypes.DATE,
      allowNull: false,
    },
    'announce': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'picture_name': {
      type: DataTypes.TEXT,
    },
    'full_text': {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Article;
};
