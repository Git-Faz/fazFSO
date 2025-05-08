const express = require('express');
const app = express();

app.use(express.json());

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/', (req, res) => {
    res.status(200).send('<h1>phonebook server</h1>');
})

app.get('/api/persons', (req, res) => {
    res.send(persons);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        res.send(person);
    } else {
        res.status(404).send('person not found').end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {

    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(p => p.id))
            : 0;
        return maxId + 1;
    }

    const person = req.body;
    if (!person.name || !person.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }
    person.id = generateId();
    persons = persons.concat(person);
    res.json(person);
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info of ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})
