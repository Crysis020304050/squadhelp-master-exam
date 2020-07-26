'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('RefreshTokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            value: {
                type: Sequelize.TEXT,
                allowNull: false,
                unique: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }).then(() => (
            queryInterface.sequelize.query('create or replace function check_user_tokens_count()\n' +
                'returns trigger as $$\n' +
                '        begin\n' +
                '        if (select count(*) from "RefreshTokens" where "userId"=new."userId") > 4 then\n' +
                '            delete from "RefreshTokens" where id = (select id from "RefreshTokens" where "userId"=new."userId"\n' +
                '            order by "createdAt" limit 1);\n' +
                '        end if;\n' +
                '        return new;\n' +
                '    end;\n' +
                '    $$ language plpgsql;')
        )).then(() => (
            queryInterface.sequelize.query('create trigger token_inserting_count\n' +
                '    before insert\n' +
                '    on "RefreshTokens"\n' +
                '    for each row\n' +
                '    execute procedure check_user_tokens_count();')
        ));
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('RefreshTokens').then(() => (
            queryInterface.sequelize.query('drop trigger if exists token_inserting_count on "RefreshTokens";')
        )).then(() => (
            queryInterface.sequelize.query('drop function if exists check_user_tokens_count();')
        ));
    }
};