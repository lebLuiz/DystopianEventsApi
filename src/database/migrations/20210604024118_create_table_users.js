
exports.up = knex => knex.schema.createTable('users', table => {
    table.increments('iduser');
    table.text('email').unique().notNullable();
    table.text('pass').notNullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable('users');