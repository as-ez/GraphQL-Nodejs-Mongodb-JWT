const { GraphQLString, GraphQLList } = require("graphql");
const { UserType } = require("./types");
const {User} = require('../models')

const users = {
    type: new GraphQLList(UserType),
    description: 'Returns a string',
    resolve() {
        return User.find()
    }
}

module.exports = { users };