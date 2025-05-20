const Filter = ({value, onChange}) => {
  return (
    <div>
      Search by name: <input type="text" value={value} onChange={onChange} />
    </div>
  )
}

export default Filter;
 
