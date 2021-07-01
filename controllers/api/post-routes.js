const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

//finding all post
router.get('/', (req, res) => {
    Post.findAll({
            attributes: ['id',
                'title',
                'content',
                'created_at'
            ],
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        .then(dbPostData => res.json(dbPostData.reverse()))
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});
//finding one  post
router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id',
                'content',
                'title',
                'created_at'
            ],
            include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        })
        .then(dbPostData => {
            //ID error
            if (!dbPostData) {
                res.status(404).json({ message: 'ID does not match any post' });
                return;
            }
            res.json(dbPostData);
        })
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create new post
router.post('/', withAuth, (req, res) => {
    Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//edit post
router.put('/:id', withAuth, (req, res) => {
    Post.update({
            title: req.body.title,
            content: req.body.content
        }, {
            where: {
                id: req.params.id
            }
        }).then(dbPostData => {
            //id error
            if (!dbPostData) {
                res.status(404).json({ message: 'ID does not match any post' });
                return;
            }
            res.json(dbPostData);
        })
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        //id error
        if (!dbPostData) {
            res.status(404).json({ message: 'ID does not match any  post' });
            return;
        }
        res.json(dbPostData);
        //error
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;