const ContactForm = ({ newName, onNameChange, newNumber, onNumberChange, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <h2>Add a New Contact</h2>
            <div>
                name: <input type="text" value={newName} onChange={onNameChange} />
            </div>
            <div>
                number: <input type="text" value={newNumber} onChange={onNumberChange} />
            </div>
            <div>
                <button type="submit" >add</button>
            </div>
        </form>
    )
}
export default ContactForm;

