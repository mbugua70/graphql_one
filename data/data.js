const {faker} = require("@faker-js/faker");


const users  = [];


for(let i = 0; i < 10; i++){
 users.push({
    id: faker.string.uuid(),
    firstname: faker.person.firstName(),
    age: faker.number.int({min: 0, max: 65})
 })
}



console.log(users);

module.exports = users;