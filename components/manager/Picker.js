import React from 'react'
import moment from 'moment'

import { DateRangePicker } from 'react-dates'
import {
  HORIZONTAL_ORIENTATION,
  VERTICAL_ORIENTATION,
} from 'react-dates/constants'

class DateRangePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: moment().subtract(1, 'day'),
      endDate: moment(),
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    const { focusedInput, startDate, endDate } = this.state;
    return (
      <div>
        <DateRangePicker
          {...this.props}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          withFullScreenPortal={true}
          orientation={VERTICAL_ORIENTATION}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  }
}

export default DateRangePickerWrapper;
