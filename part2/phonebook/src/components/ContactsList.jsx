const ContactsList = ({ contacts }) => {
    return (
        <div>
            <h2>Contacts:</h2>
            <ul>
                {contacts.length > 0 ? contacts.map(contact => <li key={contact.id}>{contact.name} : {contact.number}</li>) : <p>No contact found</p>}
            </ul>
        </div>


    )
}

export default ContactsList;