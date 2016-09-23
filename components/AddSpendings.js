import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
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

class SpendingsTable extends Component {
  render() {
    let i = 0, spendingsData;

    if(Object.keys(this.props.spendings).length) {
      spendingsData =
        <tbody>
          {_.map(this.props.spendings, (amount, category) => {
            i++
            return (
              <tr>
                <td>{i}</td>
                <td>₱&nbsp;{amount.formatMoney(2, '.', ',')}</td>
                <td>{_.capitalize(category)}</td>
                <td>
                  <Button
                    className="pull-right"
                    onClick={() => this.props.deleteSpending(category, amount)}
                    bsStyle="danger">
                    Delete
                  </Button>
                  <Button
                    className="pull-right"
                    onClick={() => this.props.editSpending(category, amount)}
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
            <td colSpan="3">₱&nbsp;{ _.map ( this.props.spendings,
                (amount) => amount).reduce((a, b) => a + b, 0).formatMoney(2, '.', ',')
              }
            </td>
          </tr>
        </tbody>
    }
    else {
      spendingsData =
      <tbody>
        <tr>
          <td colSpan="4" className="isaver-table-no-data">This table gets populated as you add your spendings.</td>
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
            <th><span className="pull-right">Edit</span></th>
          </tr>
        </thead>
        {spendingsData}
      </Table>
    )
  }
}

export default class AddSpendings extends Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.addSpending = this.addSpending.bind(this)
    this.deleteSpending = this.deleteSpending.bind(this)
    this.editSpending = this.editSpending.bind(this)
    this.state = {
      edit: '',
      amount: '',
      category: '',
      spendings: {}
    }
  }

  deleteSpending(category, amount) {
    let spendings = Object.assign({}, this.state.spendings)

    delete spendings[category]

    this.setState({spendings})
  }

  editSpending(category, amount) {

    this.setState({
      amount, category, edit: category
    })
  }

  addSpending() {
    let amount = this.state.amount
    let category = this.state.category
    let spendings = Object.assign({}, this.state.spendings)

    if(!amount || !category) {
      alert('Please specify category and amount')
      return
    }

    if(spendings[category]) {
      if(this.state.edit === category) {
        spendings[category] = parseFloat(amount)
      }
      else {
        spendings[category] += parseFloat(amount)
      }
    }
    else {
      spendings[category] = parseFloat(amount)
    }

    this.setState({spendings, amount: '', category: '', edit: ''})
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
          <h1><i className="fa fa-balance-scale fa-lg"></i> Add your expenses (DEMO)</h1>
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
              <Col sm={4}>
                <ControlLabel>Amount (₱)</ControlLabel>
                <FormGroup controlId="formBasicText">
                  <FormControl
                    className="isaver-input"
                    type="number"
                    name="amount"
                    value={this.state.amount}
                    placeholder="e.g. 25.50"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Col>
              <Col sm={6}>
                <ControlLabel>Category</ControlLabel>
                <FormGroup controlId="formBasicText">
                  <FormControl
                    className="isaver-input"
                    type="text"
                    name="category"
                    value={this.state.category}
                    placeholder="e.g. groceries, taxi, night out..."
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Col>
              <Col sm={2}>
                <ControlLabel></ControlLabel>
                <FormGroup controlId="formBasicText">
                  <div className="isaver-add-amount">
                    <Button
                      className="pull-right isaver-button"
                      onClick={this.addSpending}
                      bsStyle="info">
                      <i className="fa fa-plus" aria-hidden="true"></i> Add
                    </Button>
                  </div>
                </FormGroup>
              </Col>
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
                    {...this.state}
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
