const { Post } = require('../models');

const postData = [{
        title: 'Cake is great',
        content: 'I love cake!.',
        user_id: 1

    },
    {
        title: 'Magic blog',
        content: 'We got it working.',
        user_id: 2
    },
    {
        title: 'Comment if you  can see this',
        content: 'TESTING.',
        user_id: 3
    }
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;