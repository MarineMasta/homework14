const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

//find all users
router.get('/', (req, res) => {
    User.findAll({
            attributes: { exclude: ['[password'] }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//find one users
router.get('/:id', (req, res) => {
    User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [{
                //their post
                    model: Post,
                    attributes: [
                        'id',
                        'title',
                        'content',
                        'created_at'
                    ]
                },

                {
                    //their comment
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                },
                {
                    model: Post,
                    attributes: ['title'],
                }
            ]
        })
        .then(dbUserData => {
            //id error
            if (!dbUserData) {
                res.status(404).json({ message: 'ID does not match any user' });
                return;
            }
            res.json(dbUserData);
        })
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create new  user
router.post('/', (req, res) => {

    User.create({
        username: req.body.username,
        password: req.body.password
    })

    .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//logging in process
router.post('/login', (req, res) => {
    User.findOne({
            where: {
                username: req.body.username
            }
        }).then(dbUserData => {
            //wrong  username
            if (!dbUserData) {
                res.status(400).json({ message: 'Username does not exist!' });
                return;
            }
            const validPassword = dbUserData.checkPassword(req.body.password);
            //wrong password
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }
            req.session.save(() => {

                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({ user: dbUserData, message: 'You are now logged in!' });
            });
        })
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
//logging out process
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

//updating user info
router.put('/:id', (req, res) => {

    User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            //ID error
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'ID does not match any user!' });
                return;
            }
            res.json(dbUserData);
        })
        //error
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

//delete user
router.delete('/:id', (req, res) => {
    User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'ID does not match any user' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;