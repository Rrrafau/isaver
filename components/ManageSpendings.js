import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  removeSingleSpending,
  updateSingleSpending,
  removeSpendings,
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
      alert('Please specify category and amount')
      return
    }

    this.props.createSpending({category, amount, group})

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
              placeholder="e.g. groceries, taxi, night out..."
              onChange={this.handleChange}
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
              value={this.state.group}
              placeholder="e.g. bills or food"
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

class ManageSpendings extends Component {
  constructor() {
    super()
    this.updateSpending = this.updateSpending.bind(this)
    this.deleteSpending = this.deleteSpending.bind(this)
    this.deleteSingleSpending = this.deleteSingleSpending.bind(this)
    this.editSpending = this.editSpending.bind(this)
    this.finishEditing = this.finishEditing.bind(this)
    this.state = {
      editInputs: [],
    }
  }

  finishEditing() {
    this.setState({editInputs: []})
  }

  updateSpending(spending) {
    spending.amount = parseFloat(spending.amount)
    this.props.updateSingleSpending(spending)
  }

  deleteSpending(category, group) {
    this.props.removeSpendings({category, group})
  }

  deleteSingleSpending(_id) {
    this.props.removeSingleSpending(_id)

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
    console.log(editInputs)
    this.setState({
      editInputs
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
        <div className="isaver-header">
          <div className="container">
          <h1><i className="fa fa-balance-scale fa-lg"></i> Add your expenses&nbsp;
            <span
              style={{
                fontStyle: 'italic',
                color: '#c9d3e6',
                fontWeight: '300'
              }}
                >
            </span></h1>
          </div>
        </div>
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
                  spending={{}}
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
  removeSingleSpending,
  updateSingleSpending,
  removeSpendings,
  createSpending
})(ManageSpendings)
