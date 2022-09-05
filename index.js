const express = require("express");
const cors = require("cors");
const Person = require("./models/note")
const { response } = require("express");
const morgan = require("morgan");

const App = express(); // app vanne ma hamro server app banyo
App.use(express.static("build"));
App.use(cors()); //cors laii chalauna ko lagi yesari rakheko
App.use(express.json());
//App.use(morgan("tiny")); //using predefined format string
//App.use(morgan(":method:status")); //using format string of predefined tokens
App.use(
  // using custom format function
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);


App.get("/", (request, response) => {
  response.send("<h1>hellow world Niru</h1> "); // response.send response ko method of
});

// App.get("/info", (request, response) => {
//   var currentdate = new Date();
//   response.send(
//     `Phonebook has information for ${persons.length} people <br/>${currentdate} `
//   ); // response.send response ko method of
// });

App.get("/persons", (request, response) => {
Person.find().then(result=>response.json(result))
  //response.json(persons); // response.send response ko method of
});

App.get("/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      next(error)
      //response.status(500).end()
      //response.status(400).send({ error: 'malformatted id' })
    })
  // const currendId = Number(request.params.id);
  // const thisNote = Person.find((person) => person.id === currendId);
  // if (thisNote) response.json(thisNote); // response.send response ko method of
  // else
  //   response
  //     .status(404)
  //     .json({ error: 404, message: `There is no person with id ${currendId}` });
});

App.delete('/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
// App.delete("/persons/:id", (request, response) => {
//   const currendId = Number(request.params.id);
//   Person = Person.filter((person) => person.id !== currendId);
//   //   const thisNote = persons.find((person) => person.id === currendId);

//   response.status(204).end();
// });

// App.post("/persons/", (request, response) => {
//   let newData = request.body;
//   newData.id = Math.floor(Math.random() * 10000000);
//   let newPerson = Person.find((person) => person.name === newData.name);
//   if (newPerson) {
//     return response.status(400).json({ error: "Name must be unique" });
//   }
//   if (
//     newData.name === "" ||
//     // newData.number === "" ||
//     !newData.hasOwnProperty("name")
//     // !newData.hasOwnProperty("number")
//   ) {
//     return response.status(400).json({ error: "Missing property" });
//   }
//   Person.push(newData);
//   return response.status(201).json(newData);
// });

App.post('/persons/', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Person({
    name: body.name,
    number: body.number
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

App.put('/persons/:id', (request, response, next) => {
  const body = request.body

  const note = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
App.use(errorHandler)   //error ko middleware

const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  // server kaha listen tah port ma tyo port pani dinu parxa
  console.log(`server listening on ${PORT}`);
});
