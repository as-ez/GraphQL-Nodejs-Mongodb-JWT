const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const app = express()
const schema = require('./graohql/schema')
app.get('/', (req, res) => {
    res.send('welcome to my graphql api')
})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))
app.listen(3000)
console.log('server is running on port 3000')