const express = require("express");
const cors = require("cors");
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

App.get("/", (request, response) => {
  response.send("<h1>hellow world Niru</h1> "); // response.send response ko method of
});

App.get("/info", (request, response) => {
  var currentdate = new Date();
  response.send(
    `Phonebook has information for ${persons.length} people <br/>${currentdate} `
  ); // response.send response ko method of
});

App.get("/persons", (request, response) => {
  response.json(persons); // response.send response ko method of
});

App.get("/persons/:id", (request, response) => {
  const currendId = Number(request.params.id);
  const thisNote = persons.find((person) => person.id === currendId);
  if (thisNote) response.json(thisNote); // response.send response ko method of
  else
    response
      .status(404)
      .json({ error: 404, message: `There is no person with id ${currendId}` });
});

App.delete("/persons/:id", (request, response) => {
  const currendId = Number(request.params.id);
  persons = persons.filter((person) => person.id !== currendId);
  //   const thisNote = persons.find((person) => person.id === currendId);

  response.status(204).end();
});

App.post("/persons/", (request, response) => {
  let newData = request.body;
  newData.id = Math.floor(Math.random() * 10000000);
  let newPerson = persons.find((person) => person.name === newData.name);
  if (newPerson) {
    return response.status(400).json({ error: "Name must be unique" });
  }
  if (
    newData.name === "" ||
    // newData.number === "" ||
    !newData.hasOwnProperty("name")
    // !newData.hasOwnProperty("number")
  ) {
    return response.status(400).json({ error: "Missing property" });
  }
  persons.push(newData);
  return response.status(201).json(newData);
});
const PORT = process.env.PORT || "3001";

App.listen(PORT, () => {
  // server kaha listen tah port ma tyo port pani dinu parxa
  console.log(`server listening on ${PORT}`);
});
