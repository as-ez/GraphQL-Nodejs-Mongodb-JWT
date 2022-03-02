const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post } = require('../models');
const {createJWTToken} = require('../util/auth')
const {PostType} = require('./types')

const register = {
    type: GraphQLString,
    description: "Register a new user and returns a token",
    args: {
        username: { type: GraphQLString},
        email: { type: GraphQLString},
        password: { type: GraphQLString},
        displayName: { type: GraphQLString},
    },
    async resolve(_, args) {
        const {username, email, password, displayName} = args

        const user = new User({username, email, password, displayName})
        await user.save();

        const token = createJWTToken({
            _id: user._id,
            username: user.username, 
            email: user.email
        })

        console.log(token)
        return token;
    }
}

const login = {
    type: GraphQLString,
    description: 'Login a user and returns a token',
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    async resolve(_, args) {

        const user= await User.findOne({email: args.email}).select('+password')

        if (!user || args.password !== user.password) throw new Error('Invalid Credentials')

        const token = createJWTToken({
            _id: user._id,
            username: user.username, 
            email: user.email
        })

        return token
    }

}

const createPost = {
    type: PostType,
    description: "Create a new post",
    args: {
        title: {type: GraphQLString},
        body: {type: GraphQLString},
    },
    async resolve(_, args, { verifiedUser }) {
        
        console.log(verifiedUser)
        const post = new Post({
            title: args.title,
            body: args.title,
            authorId: verifiedUser._id,
        })

        await post.save()

        return post
    }
}

const updatePost = {
    type: PostType,
    description: "Update a post",
    args: {
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        body: {type: GraphQLString}
    },
    async resolve(_, {id, title, body}, {verifiedUser}) {
        
        if (!verifiedUser) throw new Error('No autorizado')

        const postUpdated = await Post.findOneAndUpdate(
            {authorId: verifiedUser._id, _id: id},
            {
                title,
                body
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!postUpdated) throw new Error("No post for given id");

        return postUpdated
    }
}

module.exports = {
    register,
    login,
    createPost,
    updatePost
}