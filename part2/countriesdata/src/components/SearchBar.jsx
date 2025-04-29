const SearchBar = ({search, setSearch}) => {
    return (
        <div>
            find countries: <input value = {search} onChange={setSearch} />
        </div>
    )
}

export default SearchBar;