'use stric'

const {Comments} = require('../models');

exports.findAllComments = (req, res, next) => {
    const postId = req.params.postId;
    Comments.findAll( {where: { PostId: postId }} )
    .then((comments) => {
        res.status(200).json(comments)
    })
    .catch((error) => {
        res.status(400).json({error});
    });
    
};

exports.createComment = (req, res, next) =>{
    const comment = req.body;
    console.log(comment);
    const username = req.user.username
    comment.username = username;
    Comments.create(comment)
    .then((comment) => {
        res.json(comment)
    })
    .catch((error) => {
        res.json({error});
    });
};

exports.deleteOneComment = (req, res, next) =>{
    const commentId = req.params.commentId
    console.log('id'+commentId);
    Comments.destroy( {
        where: {
            id: commentId,
        }
    })
    .then(() => {
        res.json('Comment Deleted Successfully !')
    })
    
}