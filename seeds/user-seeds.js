const { User } = require('../models');

const userData = [{
        username: 'Marine',
        password: 'MarineMasta'

    },
    {
        username: 'Oliver',
        password: 'Ollie'
    },
    {
        username: 'David',
        password: 'Dave'
    }
];

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;