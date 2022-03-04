import Loader from 'react-loader-spinner'
import {Component} from 'react'
import CategoryItem from '../CategoryItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'initial',
  inProgress: 'inProgress',
  success: 'success',
  failure: 'failure',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    categoryId: categoriesList[0].id,
    categoryList: [],
  }

  componentDidMount() {
    this.categoryList()
  }

  categoryList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {categoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${categoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedCategoryList = data.projects.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      this.setState({
        categoryList: updatedCategoryList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {categoryList} = this.state

    return (
      <ul>
        {categoryList.map(eachCategory => (
          <CategoryItem categoryDetails={eachCategory} key={eachCategory.id} />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div testid="loader">
      <Loader />
    </div>
  )

  retry = () => {
    this.categoryList()
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        // return this.renderFailureView()
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeCategory = event => {
    this.setState(
      {
        categoryId: event.target.value,
      },
      this.categoryList,
    )
  }

  render() {
    // const {categoryId} = this.state
    // console.log(categoryId)

    return (
      <div>
        <nav className="nav">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="nav-image"
          />
        </nav>
        <select onChange={this.onChangeCategory}>
          {categoriesList.map(eachItem => (
            <option value={eachItem.id} key={eachItem.id}>
              {eachItem.displayText}
            </option>
          ))}
        </select>
        <div>{this.renderView()}</div>
      </div>
    )
  }
}

export default Home
