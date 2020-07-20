const { Comment, Pizza } = require('../models');
const { db } = require('../models/Pizza');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        // create comment body
        Comment.create(body)
        .then(({ _id }) => {
            // return it with pizza
            return Pizza.findOneAndUpdate(
                // update comment to pizza id
                { _id: params.pizzaId },
                // pushing _id of comments to the specific pizza
                { $push: { comments: _id } },
                // updates new pizza with added comment
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            // respond with updated pizza data with comment
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
        // add reply
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
            res.status(404).json({ message: 'No pizza found with this id!' });
            return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
        // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
        { _id: params.commentId },
        // $pull to remove specific replies form the replies arry where replyId matches the value of params.replyId passed in from the route
        { $pull: { replies: { replyId: params.replyId } } },
        { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },
    // remove comment
    removeComment({ params }, res) {
        // finds the comment based on comment _id and deletes
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
            // use use deletedComment data to $pull from Pizza model, and update the deletion of the comment
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            // respond with updated pizza data without comment
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};


module.exports = commentController;