const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
// app.use(morgan("tiny"));
morgan.token("reqBody", function (request, _) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ":remote-addr - :remote-user [:date[clf]] :reqBody :method :url HTTP/:http-version :status :res[content-length]"
  )
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("Run serv");
});

app.get("/info", (request, response) => {
  const personsLengh = persons.length;
  const requestDate = new Date();
  response.send(
    `<p>Phonebook has info for ${personsLengh} people,</p>
    <p>${requestDate}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = "Hey, that person is not here.";
    response.status(404).end();
  }
});

function generateId() {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  // console.log("maxId", maxId);
  return String(maxId + 1);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: `name must be unique. ${body.name} already exists`,
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);
  response.statusMessage = `Hey, ${person.name} has been added`;
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const name = persons[id].name;
  persons = persons.find((person) => person.id === id);
  response.statusMessage = `Sad, seems that ${name} has been deleted`;
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
