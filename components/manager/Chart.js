import React, { Component } from 'react'
import _ from 'lodash'
import moment from 'moment'
const isBrowser = typeof window !== 'undefined';
const AmCharts = isBrowser ? require( 'amcharts3-react') : undefined;
import {
  FormGroup,
  FormControl,
  Col,
  Row,
} from 'react-bootstrap'

export default class Chart extends Component {
  constructor() {
    super()
    this.setInterval = this.setInterval.bind(this)
    this.state = {
      list: [],
      interval: 'week'
    }
  }

  setInterval(e) {
    this.setState({interval: e.target.value})
  }

  setChartData(chunkedData, categories=['all'], groups=['all']) {
    let that = this
    let chartData = _.map(chunkedData, function(datum, key) {
      let newDatum = {};

      // totals for chunk
      let sum = datum.map(function(d) {return d.amount}).reduce((a, b) => a + b, 0)

      newDatum.amount = parseFloat(sum.toFixed(2))
      newDatum.date = new Date(key)

      _.each(categories, function(category) {
        let catArr, catSum

        catArr = datum.map(function(d) {
          if(d.category === category) { // @todo disable until filtering is done
            return d.amount
          }
        })

        catArr = catArr.filter( function (n) { return n != undefined } )
        catSum = catArr.reduce((a, b) => a + b, 0)

        newDatum[category] = parseFloat(catSum.toFixed(2))
      })

      return newDatum
    });

    return chartData
  }

  createSortedList(interval='week') {
    let list = this.props.list
    let that = this

    let sorted = []
    let categories = []
    let groups = []

    _.each(list, (item) => {
      item.date = new Date(moment.unix(item.createDate))

      if(categories.indexOf(item.category) === -1) {
        categories.push(item.category)
      }
      if(groups.indexOf(item.groups) === -1) {
        groups.push(item.groups)
      }

      sorted.push(item)
    })

    sorted = sorted.sort(function(a, b) { return a.date - b.date})

    let chunkedData = _.groupBy(sorted, function (date) {
      return moment(date.createDate*1000).startOf(that.state.interval).format();
    })

    let chartData = this.setChartData(chunkedData, categories, groups)

    return chartData
  }

  render() {
    let list = this.createSortedList()

    return (
      <div>
        <Col sm={12} style={{height:570}}>
          <AmCharts
            path="/public/js/amcharts3/amcharts"
            type="serial"
            theme="light"
            fillAlphas={1}
            graphs={[{
              id: "g1",
              balloonText: "Combined: ₱[[value]]",
              valueField: "amount",
              labelText: "₱[[value]]",
              type: 'smoothedLine',
              fillAlphas: 0.25,
              bullet: 'round',
              lineThickness: 2,
              bulletBorderAlpha: 1,
              bulletColor: "#FFFFFF",
              hideBulletsCount: 50,
              title: 'Combined Average: ',
              useLineColorForBulletBorder: true
            }]}
            dataProvider={list}
            valueAxes={[{
              "axisAlpha": 0.2,
              "dashLength": 1,
              "position": "left"
            }]}
            legend={{
              position: 'top',
              labelText: '[[title]]',
              valueText: '₱[[value]]'
            }}
            startDuration={0}
            chartCursor={{
              "limitToGraph":"g1"
            }}
            categoryField='date'
            categoryAxis={{
              "minPeriod": "hh",
              "parseDates": true,
              "axisColor": "#DADADA",
              "dashLength": 1,
              "minorGridEnabled": true
            }}
            />
        </Col>
        <Col sm={12}>
          <FormGroup controlId="formBasicText" style={{paddingTop:17}}>
            <FormControl
              className="isaver-select"
              componentClass="select"
              placeholder="select"
              onChange={this.setInterval}
              >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </FormControl>
          </FormGroup>
        </Col>
      </div>
    )
  }
}
