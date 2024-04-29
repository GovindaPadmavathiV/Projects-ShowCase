import './index.css'

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Project from '../Project'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProjectsShowCase extends Component {
  state = {
    projectsData: [],
    apiStatus: apiStatusConstants.initial,
    selectedProjectCategory: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getFormattedData = data => {
    const formattedData = {
      id: data.id,
      name: data.name,
      imageUrl: data.image_url,
    }
    return formattedData
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {selectedProjectCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedProjectCategory}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.projects.map(eachProject =>
        this.getFormattedData(eachProject),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeProjectsType = event => {
    this.setState(
      {selectedProjectCategory: event.target.value},
      this.getProjectsData,
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getProjectsData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="error-msg">Oops! Something Went Wrong</h1>
      <p className="explanation-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry()}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => (
    <ul className="projects-list-container">
      {projectsData.map(eachProject => (
        <Project key={eachProject.id} projectDetails={eachProject} />
      ))}
    </ul>
  )

  getViewBasedOnApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderProjectsShowCaseView = () => {
    const {selectedProjectCategory} = this.state

    return (
      <div className="app-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>

        <div className="content-container">
          <select
            className="projects-type-container"
            value={selectedProjectCategory}
            onChange={this.onChangeProjectsType}
          >
            {categoriesList.map(eachCategory => (
              <option value={eachCategory.id} key={eachCategory.id}>
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.getViewBasedOnApiStatus()}
        </div>
      </div>
    )
  }

  render() {
    return <>{this.renderProjectsShowCaseView()}</>
  }
}

export default ProjectsShowCase
