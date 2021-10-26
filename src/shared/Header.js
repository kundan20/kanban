import React from 'react'
import { Container, Form, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap'

const Header = () => {
    return (
        <Navbar className = "bg-dark-blue">
            <Nav className="ml-auto d-none d-sm-block">
                <Nav.Link href="#home" className = "header-items">Home</Nav.Link>
                <Nav.Link href="#features" className = "header-items">Tour</Nav.Link>
                <Nav.Link href="#pricing" className = "header-items">Blog</Nav.Link>
            </Nav>
            <div className="brand-logo">
                <Navbar.Brand href="#home" className="brand">
                    <i className="fab fa-trello"></i>&nbsp; Trello
                </Navbar.Brand>
            </div>
            <div className="auth-btns">
                <button className = "common-btn signup">Sign up</button>
                <button className = "common-btn login">Login</button>
            </div>
      </Navbar>
    )
}

export default Header
