const CategoryItem = props => {
  const {categoryDetails} = props
  const {imageUrl, name} = categoryDetails

  return (
    <li>
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default CategoryItem
