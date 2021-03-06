'use strict';

module.exports = (sequelize, DataTypes, Model) => {
  class Comment extends Model {}
  Comment.init({
    'text': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'createdDate': {
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
