const express = require('express');
const expressGraphQL = require("express-graphql").graphqlHTTP
const schema = require("./schema/schema")




const app = express();

// middleware function



// to use and construct graphql
// we will need a handler function, schema, and rosolver function
app.use("/graphql", expressGraphQL({
  // development tool used to make queries to our developmemt server
  schema,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Listening');
});

// middleware are tiny function made to interface request as they comme to the server
