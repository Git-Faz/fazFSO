const ContactsList = ({ contacts, onDelete }) => {
    return (
        <div>
            <h2>Contacts:</h2>
            <ul>
                {contacts.length > 0 ? contacts.map(contact =>
                    <li className="contactList" key={contact.id}>{contact.name} : {contact.number}
                        <button className="delete" onClick={() => onDelete(contact.id)}>Delete</button>
                    </li>
                ) : <p>No contact found</p>}

            </ul>
        </div>


    )
}

export default ContactsList;