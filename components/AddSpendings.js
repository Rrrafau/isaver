import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  createSpending
} from '../actions/spendings'
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
  render() {
    return (
      <div>
        <Col sm={3}>
          <ControlLabel className="isaver-control-label">Amount (₱)</ControlLabel>
          <FormGroup controlId="formBasicText">
            <FormControl
              className="isaver-input"
              type="number"
              name="amount"
              value={this.props.amount}
              placeholder="e.g. 75.50"
              onChange={this.props.handleChange}
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
              value={this.props.category}
              placeholder="e.g. groceries, taxi, night out..."
              onChange={this.props.handleChange}
            />
          </FormGroup>
        </Col>
        <Col sm={3}>
          <ControlLabel className="isaver-control-label">Group (optional)</ControlLabel>
          <FormGroup controlId="formBasicText">
            <FormControl
              className="isaver-input"
              type="text"
              name="group"
              value={this.props.group}
              placeholder="e.g. bills or food"
              onChange={this.props.handleChange}
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
                  onClick={this.props.clearData}
                  bsStyle="warning">
                  <i className="fa fa-close" aria-hidden="true"></i>
                </Button>
                <Button
                  className="pull-right isaver-button"
                  style={{marginRight:4}}
                  onClick={this.props.addSpending}
                  bsStyle="success">
                  <i className="fa fa-check" aria-hidden="true"></i>
                </Button>
              </div>
            ) : (
              <div className="isaver-add-amount">
                <Button
                  className="pull-right isaver-button"
                  onClick={this.props.addSpending}
                  bsStyle="info">
                  <i className="fa fa-close" aria-hidden="true"></i> Add
                </Button>
              </div>
            )}
          </FormGroup>
        </Col>
      </div>
    )
  }
}

class SpendingsTable extends Component {
  calculateSpendings(list) {
    let spendings = {}

    _.each(list, function(li) {
      if(spendings[li.group+'_'+li.category]) {
        spendings[li.group+'_'+li.category].amount += li.amount
      }
      else {
        spendings[li.group+'_'+li.category] = Object.assign({}, li)
      }
    })

    return spendings
  }

  render() {
    let i = 0, spendingsData,
      spendings = this.calculateSpendings(this.props.list);

    if(Object.keys(spendings).length) {
      spendingsData =
        <tbody>
          {_.map(spendings, (spending, key) => {
            i++
            return (
              <tr key={'spendings'+key}>
                <td>{i}</td>
                <td>₱&nbsp;{parseFloat(spending.amount).formatMoney(2, '.', ',')}</td>
                <td>{_.capitalize(spending.category)}</td>
                <td>{_.capitalize(spending.group)}</td>
                <td>
                  <Button
                    className="pull-right"
                    onClick={() => this.props.deleteSpending(
                      spending.category, spending.group
                    )}
                    bsStyle="danger">
                    Delete
                  </Button>
                  <Button
                    className="pull-right"
                    onClick={() => this.props.editSpending(
                      spending.category, spending.group
                    )}
                    style={{marginRight: 16}}
                    bsStyle="warning">
                    Edit
                  </Button>
                </td>
              </tr>
            )
          })}
          <tr>
            <td>Total</td>
            <td colSpan="4">₱&nbsp;{ _.map ( spendings,
                (spending) => parseFloat(spending.amount)).reduce((a, b) => a + b, 0).formatMoney(2, '.', ',')
              }
            </td>
          </tr>
        </tbody>
    }
    else {
      spendingsData =
      <tbody>
        <tr>
          <td colSpan="5" className="isaver-table-no-data">This table gets populated as you add your spendings.</td>
        </tr>
      </tbody>
    }

    return (
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Group</th>
            <th><span className="pull-right">Edit</span></th>
          </tr>
        </thead>
        {spendingsData}
      </Table>
    )
  }
}

class AddSpendings extends Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.addSpending = this.addSpending.bind(this)
    this.deleteSpending = this.deleteSpending.bind(this)
    this.editSpending = this.editSpending.bind(this)
    this.clearData = this.clearData.bind(this)
    this.state = {
      edit: '',
      amount: '',
      category: '',
      group: ''
    }
  }

  deleteSpending(category, group) {
    let list = Object.assign([], this.state.list)
    let newList = []

    _.each(list, function(li) {
      if(li.category !== category || li.group !== group) {
        newList.push(li)
      }
    })
  }

  clearData() {
      this.setState({
        edit: '',
        amount: '',
        group: '',
        category: ''
      })
  }

  editSpending(category, group) {
    this.setState({
      edit: {group, category}
    })
  }

  addSpending() {
    let amount = parseFloat(this.state.amount)
    let category = this.state.category
    let group = this.state.group

    if(!amount || !category) {
      alert('Please specify category and amount')
      return
    }

    this.clearData()

    this.props.createSpending({category, amount, group})
  }

  handleChange(e) {
    let change = {}
    change[e.target.name] = e.target.value

    this.setState( change )
  }

  render() {
    return(
      <div>
        <div className="isaver-header">
          <div className="container">
          <h1><i className="fa fa-balance-scale fa-lg"></i> Add your expenses&nbsp;
            <span style={{
                fontStyle: 'italic',
                color: '#c9d3e6',
                fontWeight: '300'}}
                >
                (demo)
            </span></h1>
          </div>
        </div>
        <div className="container">
          <Row>
            <Col xs={12}>
              <h3>Enter the amount and category</h3>
            </Col>
          </Row>
          <Row>
            <form>
              {this.state.edit ? (
                this.state.list.map((li, key) => {
                  if(li.group === this.state.edit.group
                      && li.category === this.state.edit.category) {
                    console.log(key)
                    return (
                      <Inputs
                        handleChange={this.handleChange}
                        addSpending={this.addSpending}
                        clearData={this.clearData}
                        category={li.category}
                        group={li.group}
                        amount={li.amount}
                        key={key}
                        edit={this.state.edit}
                      />
                    )
                  }
                  else {
                    return null
                  }
                })
              ) : (
                <Inputs
                  handleChange={this.handleChange}
                  addSpending={this.addSpending}
                  clearData={this.clearData}
                  {...this.state}
                />
              )}
              <Col sm={12}><span className="isaver-helptext">
                ...if category doesn't exist, it will be automatically created and
                visible next time you use the category field.
              </span></Col>
            </form>
          </Row>
          <hr></hr>
          <Row>
            <Col sm={12}>
              <Col sm={12}>
                <Row>
                  <h3>Current Spendings</h3>
                  <SpendingsTable
                    deleteSpending={this.deleteSpending}
                    editSpending={this.editSpending}
                    list={this.props.list}
                  />
                </Row>
              </Col>
              <Col sm={10}></Col>
            </Col>
            <Col sm={2} smOffset={10}>
              <Button className="pull-right isaver-button" bsStyle="success">
                <i className="fa fa-plus" aria-hidden="true"></i> Submit
              </Button>
            </Col>
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { list } = state.spendings
  const { profile, isAuthenticated } = state.auth
  return {
    list, profile, isAuthenticated
  }
}

export default connect(mapStateToProps, {
  createSpending
})(AddSpendings)
