const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>  (2 parameters, adter deleting a comment, we need to know which pizza that comment orignated from)
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;