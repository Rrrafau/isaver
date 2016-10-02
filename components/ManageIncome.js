import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'
import Chart from './manager/Chart'
import MoneyTable from './manager/MoneyTable'

import {
  removeSingleIncome,
  updateSingleIncome,
  createIncome,
  getIncome
} from '../actions/income'
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
    this.addIncome = this.addIncome.bind(this)
    this.state = {
      amount: '',
      group: '',
      category: ''
    }
  }

  addIncome() {
    let amount = parseFloat(this.state.amount)
    let category = this.state.category
    let group = this.state.group

    if(!amount || !category) {
      alert('Please specify an amount, category and group')
      return
    }

    this.props.createIncome({
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
    this.setState(this.props.income)
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
              placeholder="e.g. 10000"
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
              placeholder="e.g. Facebook"
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
              placeholder="e.g. Salary"
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
                  onClick={() => this.props.deleteSingleIncome(
                    this.state._id
                  )}
                  bsStyle="danger">
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </Button>
                <Button
                  className="pull-right isaver-button"
                  style={{marginRight:4}}
                  onClick={() => this.props.updateIncome(
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
                  onClick={this.addIncome}
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

// TODO consolidate with managespendings
class ManageIncome extends Component {
  constructor() {
    super()
    this.updateIncome = this.updateIncome.bind(this)
    this.deleteSingleIncome = this.deleteSingleIncome.bind(this)
    this.editIncome = this.editIncome.bind(this)
    this.finishEditing = this.finishEditing.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.setMode = this.setMode.bind(this)
    this.state = {
      editInputs: [],
    }
  }

  finishEditing() {
    this.setState({editInputs: []})
  }

  setMode(mode) {
    this.setState({mode})
  }

  componentWillMount() {
    if(this.props.profile) {
      this.props.getIncome({
        userID: this.props.profile.email,
        timeline: 'day'
      })
    }
  }

  updateIncome(income) {
    income.amount = parseFloat(income.amount)
    this.props.updateSingleIncome(income)
  }

  deleteSingleIncome(_id) {
    this.props.removeSingleIncome({_id})

    let editInputs = Object.assign([], this.state.editInputs)

    editInputs = editInputs.filter((input) => input.key != _id)

    this.setState({editInputs})
  }

  editIncome(category, group) {
    let editInputs = this.props.list.map((li) => {
      if(li.group === group && li.category === category) {
        return (
          <Inputs
            deleteSingleIncome={this.deleteSingleIncome}
            updateIncome={this.updateIncome}
            income={li}
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
    this.props.getIncome({
      userID: this.props.profile.email,
      timeline: e.target.value
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
        <div className="isaver-header isaver-income">
          <div className="container">
            <h1>
              <i className="fa fa-line-chart fa-lg"></i> Add your income&nbsp;
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
                  income={{}}
                  profile={this.props.profile}
                  createIncome={this.props.createIncome}
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
              <h3>Current Income</h3>
            </Col>
            <Col sm={6}>
              <FormGroup controlId="formBasicText" style={{paddingTop:17}}>
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
                  <option value="all">All</option>
                </FormControl>
              </FormGroup>
            </Col>
            {this.state.mode === 'table' ? (
            <Col sm={12}>
              <MoneyTable
                editItem={this.editIncome}
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
  const { list } = state.income
  const { profile, isAuthenticated } = state.auth
  return {
    list, profile, isAuthenticated
  }
}

export default connect(mapStateToProps, {
  removeSingleIncome,
  updateSingleIncome,
  createIncome,
  getIncome
})(ManageIncome)
