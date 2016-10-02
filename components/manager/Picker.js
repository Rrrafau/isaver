import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { SingleDatePicker } from 'react-dates'
import {
  VERTICAL_ORIENTATION,
} from 'react-dates/constants'

class SingleDatePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
    };

    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  render() {
    const { focused, date } = this.state;

    return (
      <SingleDatePicker
        {...this.props}
        enableOutsideDays={true}
        focused={focused}
        withFullScreenPortal={true}
        orientation={VERTICAL_ORIENTATION}
        onFocusChange={this.onFocusChange}
        isOutsideRange={() => false}
        numberOfMonths={0}
        displayFormat="ll"
      />
    );
  }
}

function mapStateToProps(state) {
  const { startDate, endDate } = state.dates
  return {
    startDate, endDate
  }
}

export default connect(mapStateToProps, {
})(SingleDatePickerWrapper)
