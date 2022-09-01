const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const noteSchema = new mongoose.Schema({
    name: String,
    number: String
    
}) 

const Person = mongoose.model('person', noteSchema)
//const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/?retryWrites=true&w=majority`
const url = `mongodb+srv://pratiksha:${password}@cluster0.cnk2vze.mongodb.net/Phonebook?retryWrites=true&w=majority`




mongoose
.connect(url)
.then((result) => {
    console.log('connected')


    if(process.argv.length>3){
    
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4]
    })
  person.save().then((result) => {   //do not use ".then()" after ".then()", usually it doesn't come one after other, it's rare case
    // result.forEach((note) => {
    //     console.log(note)
    //   })
    // console.log(result);
    console.log(`added ${result.name} ${result.number} to phonebook!`)
    return mongoose.connection.close()
  })
}
})
//   const notes = Note.find({})
  //return person

  .catch((err) => console.log(err))
if(process.argv.length===3){
  Person.find({}).then((result)=>{console.log("phonebook")
 result.forEach((x)=>{console.log(x.name, x.number)})
 console.log('note saved!')
 return mongoose.connection.close()
})
.catch((err)=>console.log("this is error ",err.message))
}
