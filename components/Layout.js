import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { login, logout } from '../actions';

class Layout extends Component {
  constructor(props) {
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  handleLoginClick() {
    this.props.login()
  }

  handleLogoutClick() {
    this.props.logout()
  }

  render() {
    const { isAuthenticated, profile } = this.props
    return (
      <div>{this.props.children}</div>
    )
  }
}

function mapStateToProps(state) {
  const { auth } = state
  const { isAuthenticated, profile } = auth
  return {
    isAuthenticated,
    profile
  }
}

export default connect(mapStateToProps, {
  login,
  logout
})(Layout)
