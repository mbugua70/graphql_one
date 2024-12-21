// schema is what tell our graphql our data looks like
const graphql  = require("graphql")
// const __ = require("lodash")
// const users = require("../data/data")
const axios = require("axios");
const { response } = require("express");

const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull} = graphql;
// GraphQLSchema takes in a root query and return a schema  instance.

const CompanyType  = new  GraphQLObjectType({
    name: "Company",
    fields: () => ( {
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`http://localhost:3000/users?companyId=${parentValue.id}`)
                .then(res => res.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    // it has two part, name in strings, and fields
    name: "User",
    fields: () => ({
    //  this one contains the properties of our data
     id: {type: GraphQLString} ,
     firstname: {type: GraphQLString},
     age: {type: GraphQLInt},
    //  relation between users to company
     company: {
        type: CompanyType,
        resolve(parentValue, args) {
            // console.log(parentValue, args)
            return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
            .then(response => response.data)
        }
    }
    })
})

// root query allows us to jump in into our graph of data.
// an entry point into our data.

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
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
        },

        // adding another root query type
        // this will enable multple root query
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args){
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(res => res.data)
            }
        }
    }
})


const mutations = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            // the type below is what it get returned in the resolve
            // hence sometimes what we are adding to your database sometimes is not the same what we could be returning in our resolver function.
            type: UserType,
            // GraphQLNonNull tell the graphql whenever one is trying to add a new user he or she should provide the two
            args: {
                firstname: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                companyId: {type: GraphQLString}
            },
            resolve(parentValue, {firstname, age}){
                return axios.post("http://localhost:3000/users", {firstname, age})
                .then(res => res.data)

            }

        },

        // delete function/mutation
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
              return axios.delete(`http://localhost:3000/users/${args.id}`)
              .then(res => res.data)
            }
        },

        // update mutation / function
        editUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstname: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, {firstname, age, id}){
                return axios.patch(`http://localhost:3000/users/${id}`, {firstname,age})
                .then(res => res.data)
            }
        }
    }
})


const Schema = new GraphQLSchema({
    mutation: mutations,
    query: RootQuery
})

module.exports = Schema;


// NOTES

// you can also name your query i.e query findCompany
// the use of query fragament
// instead of writing same property in a company you want to fetch..
// you can use query fragment to avoid copy and pasting everytime

// fragement companyDetails on Company{
//     id,
//     name,
//     description
// }


// data munipulaton using mutations
//

// client tech with graphql
// lokka
// apollo client -it  has also apollo stack to use on the backend
// relay