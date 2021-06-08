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
    timestamps: false,
    paranoid: false,
  });

  return Comment;
};
