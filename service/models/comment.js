'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Comment extends Model {}
  Comment.init({
    'comment_id': {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    'comment_text': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'created_date': {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Comment;
};
