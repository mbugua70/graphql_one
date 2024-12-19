// schema is what tell our graphql our data looks like
const graphql  = require("graphql")
// const __ = require("lodash")
// const users = require("../data/data")
const axios = require("axios");
const { response } = require("express");

const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema} = graphql;
// GraphQLSchema takes in a root query and return a schema  instance.

const UserType = new GraphQLObjectType({
    // it has two part, name in strings, and fields
    name: "User",
    fields: {
    //  this one contains the properties of our data
     id: {type: GraphQLString} ,
     firstname: {type: GraphQLString},
     age: {type: GraphQLInt},
    }
})

// root query allows us to jump in into our graph of data.
// an entry point into our data.

const RootQuery = new GraphQLObjectType({
    name: "RootUserQuery",
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            // resolve fun is used to go to the database and grab the data we are looking for.
            // the id passed as an arguement above will also be expected to be available in the code below
            resolve(parentValue, args) {
            //   return __.find(users, {id: args.id})
            return axios.get(`http://localhost:3000/users/${args.id}`)
            .then(response => response.data)
            }
        }
    }
})


const Schema = new GraphQLSchema({
    query: RootQuery
})

module.exports = Schema;