const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');
router.get('/', (req, res) => {
    //Finding all comments
    Comment.findAll({})
    //shows the comments' data
        .then(dbCommentData => res.json(dbCommentData))
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});
//ID routing
router.get('/:id', (req, res) => {
    Comment.findAll({
            where: {
                id: req.params.id
            }
        })
        .then(dbCommentData => res.json(dbCommentData))
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

//updating comment
router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            })
            .then(dbCommentData => res.json(dbCommentData))
            //error
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    }
});

//editing comment
router.put('/:id', withAuth, (req, res) => {
    Comment.update({
        comment_text: req.body.comment_text
    }, {
        where: {
            id: req.params.id
        }
    }).then(dbCommentData => {
        //ID error
        if (!dbCommentData) {
            res.status(404).json({ message: 'ID does not match any comment' });
            return;
        }
        res.json(dbCommentData);
        //error
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//deleting comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbCommentData => {
        //ID error
        if (!dbCommentData) {
            res.status(404).json({ message: 'ID does not match any  comment' });
            return;
        }
        res.json(dbCommentData);
        //error
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
module.exports = router;