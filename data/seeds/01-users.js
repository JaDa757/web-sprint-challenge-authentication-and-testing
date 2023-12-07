exports.seed = function (knex) {
    return knex('users')
        .truncate()
        .then(function () {
            return knex('users').insert([
                { username: 'user1', password: 'password1' },
                { username: 'user2', password: 'password2' },
                { username: 'user3', password: 'password3' },
            ]);
        });
};
