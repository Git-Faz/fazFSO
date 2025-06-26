import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Person } from './models/person.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
}

app.get('/', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
})

//route to get all persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result);
    });
})

// route to add a new person
app.post('/api/persons', (req, res, next) => {
    const person = req.body;
    if (!person.name || !person.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    if (person.name.length < 3) {
        return res.status(400).json({ error: 'name must be at least 3 characters long' });
    }

    if (person.number.length < 8) {
        return res.status(400).json({ error: 'number must be at least 8 characters long' });
    }

    if (!/^\d{2,3}-\d+$/.test(person.number)) {
        return res.status(400).json({ error: 'number must be in the format XX-XXXXXXX or XXX-XXXXXXX' });
    }

    Person.findOne({ name: person.name })
        .then(existingPerson => {
            if (existingPerson) {
                return res.status(400).json({ error: 'name must be unique' });
            }

            const newPerson = new Person({
                name: person.name,
                number: person.number
            });

            return newPerson.save();
        })
        .then(savedPerson => {
            if (savedPerson) {
                res.json(savedPerson);
            }
        })
        .catch(error => next(error));
})
app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).send('person not found').end();
            }
        })
        .catch(error => next(error));
});

// route to update a person
app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const person = req.body;

    if (!person.name || !person.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    Person.findByIdAndUpdate(id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).send('person not found').end();
            }
        })
        .catch(error => next(error));
})

//route to delete a person
app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
})

//route to get info about the phonebook
app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info of ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
})

// Middleware for handling errors
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})
