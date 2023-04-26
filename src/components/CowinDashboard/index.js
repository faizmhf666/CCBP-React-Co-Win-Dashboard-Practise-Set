// step 0 importing react,Component, creating  class and render-block export statement etc...
// step 1 making api get call from componentDiDMount()
// step 2 mapping/cleaning data from api call in response.json()
// step 4 create  and import components-files required for the app
// step 5 creating and defining state as required api status with refined response data and apiStatusCodes, State update cases
// step 6 creating functions to render page based on apiStatus code in state , success, failure and loading(import Loader)
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

const apiStatusCodes = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  // creating and defining state as required
  state = {
    coWinDataList: {},
    currentStatusApi: '',
  }

  componentDidMount() {
    this.getCoWinData()
  }

  // making api get call

  getCoWinData = async () => {
    this.setState({currentStatusApi: apiStatusCodes.loading})
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    if (response.ok === true) {
      const responseData = await response.json()
      // mapping/cleaning data from response.json() call
      const updatedData = {
        lastWeekData: responseData.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationByAge: responseData.vaccination_by_age.map(each => ({
          age: each.age,
          count: each.count,
        })),
        vaccineByGender: responseData.vaccination_by_gender.map(each => ({
          count: each.count,
          gender: each.gender,
        })),
      }
      this.setState({
        coWinDataList: updatedData,
        currentStatusApi: apiStatusCodes.success,
      })
    } else {
      this.setState({currentStatusApi: apiStatusCodes.failure})
    }
  }

  renderSuccess = () => {
    const {coWinDataList} = this.state
    return (
      <div>
        <VaccinationCoverage
          vaccinationCoverageData={coWinDataList.lastWeekData}
        />

        <VaccinationByAge
          vaccinationByAgeData={coWinDataList.vaccinationByAge}
        />
        <VaccinationByGender
          vaccinationByGenderData={coWinDataList.vaccineByGender}
        />
      </div>
    )
  }

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1> Something went wrong</h1>
    </div>
  )

  renderLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderDisplayAsStatus = () => {
    const {currentStatusApi} = this.state

    switch (currentStatusApi) {
      case apiStatusCodes.loading:
        return this.renderLoading()
      case apiStatusCodes.success:
        return this.renderSuccess()
      case apiStatusCodes.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <h1>Co-WIN</h1>
        </div>
        <h1>CoWIN Vaccination in India</h1>
        {this.renderDisplayAsStatus()}
      </div>
    )
  }
}
export default CowinDashboard
