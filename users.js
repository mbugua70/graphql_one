const { faker } = require('@faker-js/faker');
const fs = require("fs");



    const users = []
    const companies = [];

    for(let i = 0; i < 20; i++){
        companies.push({
           id: faker.string.uuid(),
           name: faker.company.name(),
           description: faker.company.buzzPhrase()
        })
       }


    for(let i = 0; i < 20; i++){
        const randomCompany = companies[Math.floor(Math.random() * companies.length)]
        users.push({
            id: faker.string.uuid(),
            firstname: faker.person.firstName(),
            age: faker.number.int({min: 0, max: 65}),
            companyId: randomCompany.id
        })
    }






    const data = {users, companies}

    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2), 'utf8');