const { Comment } = require('../models');

const commentData = [{
        comment_text: "Wow you did it!",
        user_id: 1,
        post_id: 2
    },
    {
        comment_text: "Is this thing on?",
        user_id: 2,
        post_id: 3
    },
    {
        comment_text: "Test test",
        user_id: 3,
        post_id: 1
    }
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;