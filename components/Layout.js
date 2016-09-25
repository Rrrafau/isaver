import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { login, logout } from '../actions'
import {
  Navbar,
  NavItem,
  Nav,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap'

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
      <div>
        <Navbar inverse className="isaver-navbar">
          <Navbar.Header>
            <Navbar.Brand style={{color:'#fff'}}>
              <span>SMART</span><i style={{fontWeight:300}}>SAVER</i>&nbsp;<i className="fa fa-book" aria-hidden="true"></i>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem active={true}>
                <i className="fa fa-plus-square" aria-hidden="true"></i>&nbsp;
                Add Spendings
              </NavItem>
              <NavItem>
                <i className="fa fa-line-chart" aria-hidden="true"></i>&nbsp;
                Dashboard
              </NavItem>
            </Nav>
            { this.props.isAuthenticated ?
              (
                <Nav pullRight>
                  <Link to="profile"><img className="isaver-navbar-profile-picture" src={this.props.profile.picture} /></Link>
                  <NavItem>
                      <i className="fa fa-user fa-lg" aria-hidden="true"></i>
                  </NavItem>
                  <NavItem onClick={this.handleLogoutClick} >
                    <i className="fa fa-sign-out fa-lg" aria-hidden="true"></i>
                  </NavItem>
                </Nav>
              ) : (
                <Nav pullRight>
                  <NavItem onClick={this.handleLoginClick} ><i className="fa fa-sign-in" aria-hidden="true"></i> LOGIN</NavItem>
                </Nav>
              )
            }
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
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
