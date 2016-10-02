import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import Chart from './manager/Chart'
import MoneyTable from './manager/MoneyTable'
import SingleDatePickerWrapper from './manager/Picker'
import {
  removeSingleSpending,
  updateSingleSpending,
  createSpending,
  getSpendings
} from '../actions/spendings'
import {
  setDates
} from '../actions/dates'
import {
  FormGroup,
  FormControl,
  Col,
  Row,
  Table,
  ControlLabel,
  Button
} from 'react-bootstrap'

Number.prototype.formatMoney = function(c, d, t){
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

class Inputs extends Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.addSpending = this.addSpending.bind(this)
    this.state = {
      amount: '',
      group: '',
      category: ''
    }
  }

  addSpending() {
    let amount = parseFloat(this.state.amount)
    let category = this.state.category
    let group = this.state.group

    if(!amount || !category) {
      alert('Please specify an amount, category and group')
      return
    }

    this.props.createSpending({
      createDate: Math.floor(new Date().getTime() / 1000),
      userID: this.props.profile.email,
      category, amount, group
    })

    this.clearData()
  }

  clearData() {
    this.setState({
      amount: '',
      group: '',
      category: ''
    })
  }

  componentWillMount() {
    this.setState(this.props.spending)
  }

  handleChange(e) {
    let change = {}
    change[e.target.name] = e.target.value

    this.setState( change )
  }

  render() {
    return (
      <div>
        <Col sm={3}>
          <ControlLabel className="isaver-control-label">Amount (₱)</ControlLabel>
          <FormGroup controlId="formBasicText">
            <FormControl
              className="isaver-input"
              type="text"
              name="amount"
              step="0.01"
              value={this.state.amount}
              placeholder="e.g. 75.50"
              onChange={this.handleChange}
            />
          </FormGroup>
        </Col>
        <Col sm={4}>
          <ControlLabel className="isaver-control-label">Category</ControlLabel>
          <FormGroup controlId="formBasicText">
            <FormControl
              className="isaver-input"
              type="text"
              name="category"
              value={this.state.category}
              placeholder="e.g. oranges"
              onChange={this.handleChange}
            />
          </FormGroup>
        </Col>
        <Col sm={3}>
          <ControlLabel className="isaver-control-label">Group</ControlLabel>
          <FormGroup controlId="formBasicText">
            <FormControl
              className="isaver-input"
              type="text"
              name="group"
              value={this.state.group}
              placeholder="e.g. groceries"
              onChange={this.handleChange}
            />
          </FormGroup>
        </Col>
        <Col sm={2} className="isaver-edit-buttons">
          <ControlLabel></ControlLabel>
          <FormGroup controlId="formBasicText">
            {this.props.edit ? (
              <div className="isaver-add-amount">
                <Button
                  className="pull-right isaver-button"
                  onClick={() => this.props.deleteSingleSpending(
                    this.state._id
                  )}
                  bsStyle="danger">
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </Button>
                <Button
                  className="pull-right isaver-button"
                  style={{marginRight:4}}
                  onClick={() => this.props.updateSpending(
                    Object.assign({}, this.state)
                  )}
                  bsStyle="warning">
                  <i className="fa fa-save" aria-hidden="true"></i>
                </Button>
              </div>
            ) : (
              <div className="isaver-add-amount">
                <Button
                  className="pull-right isaver-button"
                  onClick={this.addSpending}
                  bsStyle="info">
                  <i className="fa fa-plus" aria-hidden="true"></i> Add
                </Button>
              </div>
            )}
          </FormGroup>
        </Col>
      </div>
    )
  }
}

// TODO consolidate with manageincome
class ManageSpendings extends Component {
  constructor() {
    super()
    this.updateSpending = this.updateSpending.bind(this)
    this.deleteSingleSpending = this.deleteSingleSpending.bind(this)
    this.editSpending = this.editSpending.bind(this)
    this.finishEditing = this.finishEditing.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.changeStartDate = this.changeStartDate.bind(this)
    this.changeEndDate = this.changeEndDate.bind(this)
    this.setMode = this.setMode.bind(this)
    this.state = {
      editInputs: [],
      mode: 'table',
    }
  }

  finishEditing() {
    this.setState({editInputs: []})
  }

  fetchByDateRange(dates) {
    if(this.props.profile) {
      this.props.getSpendings(Object.assign({}, {
        userID: this.props.profile.email,
        startDate: this.props.startDate.format('MM DD YYYY'),
        endDate: this.props.endDate.format('MM DD YYYY')
      }, dates))
    }
  }

  changeStartDate(date) {
    this.fetchByDateRange({startDate: date.format('MM DD YYYY')})
  }

  changeEndDate(date) {
    this.fetchByDateRange({endDate: date.format('MM DD YYYY')})
  }

  setMode(mode) {
    this.setState({mode})
  }

  componentWillMount() {
    this.fetchByDateRange({})
  }

  componentDidUpdate(prev) {
    if(this.props.isAuthenticated && !prev.isAuthenticated) {
      this.fetchByDateRange({})
    }
  }

  componentWillReceiveProps(nextProps) {
    document.body.classList.toggle('isaver-no-scroll', nextProps.isFetching)
  }

  updateSpending(spending) {
    spending.amount = parseFloat(spending.amount)
    this.props.updateSingleSpending(spending)
  }

  deleteSingleSpending(_id) {
    this.props.removeSingleSpending({_id})

    let editInputs = Object.assign([], this.state.editInputs)

    editInputs = editInputs.filter((input) => input.key != _id)

    this.setState({editInputs})
  }

  editSpending(category, group) {
    let editInputs = this.props.list.map((li) => {
      if(li.group === group && li.category === category) {
        return (
          <Inputs
            deleteSingleSpending={this.deleteSingleSpending}
            updateSpending={this.updateSpending}
            spending={li}
            key={li._id}
            edit={true}
          />
        )
      }
      else {
        return null
      }
    }).filter((input) => input)

    this.setState({
      editInputs
    })
  }

  fetchData(e) {
    let startDate, endDate;

    switch(e.target.value) {
      case 'today':
        startDate = moment().format('MM DD YYYY')
        endDate = moment().add(1, 'day').format('MM DD YYYY')
        break;
      case 'yesterday':
        startDate = moment().subtract(1, 'day').format('MM DD YYYY')
        endDate = moment().format('MM DD YYYY')
        break;
      case 'week':
        startDate = moment().startOf('week').format('MM DD YYYY')
        endDate = moment().endOf('week').format('MM DD YYYY')
        break;
      case 'lastweek':
        startDate = moment().subtract(1, 'week').startOf('week').format('MM DD YYYY')
        endDate = moment().subtract(1, 'week').endOf('week').format('MM DD YYYY')
        break;
      case 'month':
        startDate = moment().startOf('month').format('MM DD YYYY')
        endDate = moment().endOf('month').format('MM DD YYYY')
        break;
      case 'lastmonth':
        startDate = moment().subtract(1, 'month').startOf('month').format('MM DD YYYY')
        endDate = moment().subtract(1, 'month').endOf('month').format('MM DD YYYY')
        break;
      case 'max':
        startDate = 'max'
        endDate = moment().format('MM DD YYYY')
        break;
    }

    this.fetchByDateRange({
      startDate: startDate,
      endDate: endDate
    })
  }

  handleChange(e) {
    let change = {}
    change[e.target.name] = e.target.value

    this.setState( change )
  }

  render() {
    return(
      <div>
        { this.props.isFetching ? (
        <div className="isaver-ajax-container">
          <i className="isaver-ajax-spinner fa fa-spinner fa-pulse fa-5x fa-fw"></i>
          <span className="sr-only">Loading...</span>
        </div>
        ) : (null)}
        <div className="isaver-header">
          <div className="container">
            <h1>
              <i className="fa fa-calculator fa-lg"></i> Add your expenses&nbsp;
              <span
                style={{
                  fontStyle: 'italic',
                  color: '#c9d3e6',
                  fontWeight: '300'
                }}
                  >
              </span>
            </h1>
            {this.state.mode === 'table' ? (
              <div className="pull-right isaver-mode-buttons">
                <div className="isaver-mode active" onClick={() => this.setMode('table')}>
                  <i className="fa fa-list fa-3x"></i>
                </div>
                <div className="isaver-mode" onClick={() => this.setMode('chart')}>
                  <i className="fa fa-bar-chart fa-3x"></i>
                </div>
              </div>
            ) : (
              <div className="pull-right isaver-mode-buttons">
                <div className="isaver-mode" onClick={() => this.setMode('table')}>
                  <i className="fa fa-list fa-3x"></i>
                </div>
                <div className="isaver-mode active" onClick={() => this.setMode('chart')}>
                  <i className="fa fa-bar-chart fa-3x"></i>
                </div>
              </div>
            )}
          </div>
        </div>
      {(!this.props.isAuthenticated) ? (
        <div className="container">
          <Row>
            <Col xs={12}>
              <h1>Please Log In.</h1>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="container">
          <Row>
            <Col xs={12} className="isaver-dp-container">
              <div className="isaver-dp pull-left">
                <i className="fa fa-calendar fa-lg" aria-hidden="true"></i>
              </div>
              <div className="pull-left">
                <SingleDatePickerWrapper
                  date={moment(this.props.startDate)}
                  onDateChange={this.changeStartDate}
                  placeholder="Start Date"
                  id="date_start"
                  />
              </div>
              <div className="isaver-dp pull-left">
                <i className="fa fa-arrow-right fa-lg" aria-hidden="true"></i>
              </div>
              <div className="pull-left">
                <SingleDatePickerWrapper
                  date={moment(this.props.endDate)}
                  placeholder="End Date"
                  onDateChange={this.changeEndDate}
                  id="date_end"
                  />
              </div>
              <h3 className="isaver-h3-select pull-left">or</h3>
              <FormGroup controlId="formBasicText" className="isaver-dr-select">
                <FormControl
                  className="isaver-select"
                  componentClass="select"
                  placeholder="select"
                  onChange={this.fetchData}
                  >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This Week</option>
                  <option value="lastweek">Last Week</option>
                  <option value="month">This Month</option>
                  <option value="lastmonth">Last Month</option>
                  <option value="max">Max</option>
                </FormControl>

                <i className="fa fa-caret-down isaver-select-caret-down"></i>
                <i className="fa fa-caret-up isaver-select-caret-up"></i>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <h3>Enter the amount, category and group</h3>
            </Col>
          </Row>
          <Row>
            <form>
              {this.state.editInputs.length ? (
                this.state.editInputs
              ) : (
                <Inputs
                  spending={{}}
                  profile={this.props.profile}
                  createSpending={this.props.createSpending}
                />
              )}
              {this.state.editInputs.length ? (
              <Col sm={12}>
                <Button
                  style={{marginBottom: 4}}
                  className="pull-right isaver-button"
                  bsStyle="success"
                  onClick={this.finishEditing}
                  >
                  <i className="fa fa-check" aria-hidden="true"></i>
                  &nbsp;Done
                </Button>
              </Col>
              ) : null }
              <Col sm={12}><span className="isaver-helptext">
                ...if category or group doesn't exist, it will be automatically created and
                visible next time you use the fields.
              </span></Col>
            </form>
          </Row>
          <hr></hr>
          <Row>
            <Col sm={6}>
              <h3>Current Spendings</h3>
            </Col>
            {this.state.mode === 'table' ? (
            <Col sm={12}>
              <MoneyTable
                editItem={this.editSpending}
                list={this.props.list}
              />
            </Col>
            ) : (
            <Col sm={12}>
              <Chart list={this.props.list}/>
            </Col>
            )}
          </Row>
          <hr></hr>
          <Row>
            <Col sm={12}>
              <h4 className="isaver-disclaimer">
                Do not worry! The data you enter is absolutely private
                and nobody except you will ever have any access to this
                information! <a>Read more</a>
              </h4>
            </Col>
          </Row>
        </div>
      )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { list } = state.spendings
  const { profile, isAuthenticated } = state.auth
  const { startDate, endDate } = state.dates
  const { isFetching } = state.ajax
  return {
    list, profile, isFetching, isAuthenticated, startDate, endDate
  }
}

export default connect(mapStateToProps, {
  removeSingleSpending,
  updateSingleSpending,
  createSpending,
  setDates,
  getSpendings
})(ManageSpendings)
