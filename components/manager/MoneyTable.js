import React, { Component } from 'react'
import _ from 'lodash'
import {
  Col,
  Table,
  Button
} from 'react-bootstrap'

export default class MoneyTable extends Component {
  calculateData(list) {
    let money = {}

    _.each(list, function(li) {
      if(money[li.group+'_'+li.category]) {
        money[li.group+'_'+li.category].amount += li.amount
        money[li.group+'_'+li.category].count ++
      }
      else {
        money[li.group+'_'+li.category] = Object.assign({}, li, {count: 1})
      }
    })

    return money
  }

  render() {
    let i = 0, moneyData, money = this.calculateData(this.props.list);

    if(Object.keys(money).length) {
      let sortable = [];

      for(let key in money) {
        sortable.push(money[key])
      }

      sortable.sort(function(a,b) {
        return b.amount - a.amount;
      })

      moneyData =
        <tbody>
          {_.map(sortable, (item, key) => {
            i++
            return (
              <tr key={'money'+key}>
                <td>{i}</td>
                <td>₱&nbsp;{parseFloat(item.amount).formatMoney(2, '.', ',')}</td>
                <td>{item.category}</td>
                <td>{item.group}</td>
                <td>{item.count}</td>
                <td>
                  <Button
                    className="pull-right"
                    onClick={() => this.props.editItem(
                      item.category, item.group
                    )}
                    bsStyle="warning">
                    Edit
                  </Button>
                </td>
              </tr>
            )
          })}
          <tr>
            <td>Total</td>
            <td colSpan="5">₱&nbsp;{ _.map ( money,
                (item) => parseFloat(item.amount)).reduce((a, b) => a + b, 0).formatMoney(2, '.', ',')
              }
            </td>
          </tr>
        </tbody>
    }
    else {
      moneyData =
      <tbody>
        <tr>
          <td colSpan="6" className="isaver-table-no-data">This table gets populated as you add your money.</td>
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
            <th># Items</th>
            <th></th>
          </tr>
        </thead>
        {moneyData}
      </Table>
    )
  }
}
