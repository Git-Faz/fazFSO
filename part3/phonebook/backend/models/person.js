import mongoose from 'mongoose';
const { set, connect, Schema, model } = mongoose;
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URI;
set('strictQuery', false);
connect(url)
    .then(() => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

const personSchema = new Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export const Person = model('Person', personSchema);