import mongoose from "mongoose";
const { set, connect, Schema, model } = mongoose;

if (process.argv.length < 3) {
  console.log("Please provide the password as an argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://Faz:${password}@cluster0.z4wyhre.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;
const newPerson = process.argv[3];
const newNumber = process.argv[4];

set("strictQuery", false);
connect(url)
  .then(() => {
    console.log("connected to MongoDB");

    const personSchema = new Schema({
      newPerson: {
        type: String,
        minLength: 3,
        required: true,
      },
      newNumber: {
        type: String,
        minLength: 8,
        validate: {
          validator: function (v) {
            return /^\d{2,3}-\d+$/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
        required: true,
      },
    });

    const Person = model("Person", personSchema);

    const person = new Person({
      newPerson: newPerson,
      newNumber: newNumber,
    });

    if (newPerson === undefined || newNumber === undefined) {
      console.log("phonebook:");
      return Person.find({}).then((result) => {
        result.forEach((person) => {
          console.log(`${person.newPerson} : ${person.newNumber}`);
        });
        mongoose.connection.close();
      });
    } else {
      return person.save().then(() => {
        console.log(`added ${newPerson} : ${newNumber} to phonebook`);
        mongoose.connection.close();
      });
    }
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
