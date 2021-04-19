import React, {Component} from "react";
import { LinkContainer } from 'react-router-bootstrap';
import { HashRouter, Route } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import MyCalendar from "./components/MyCalendar";
import PlaceHolder from "./components/PlaceHolder"

// import './App.css';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand>
                        monence
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Item>
                                <LinkContainer to="/">
                                    <Nav.Link>
                                        Home
                                    </Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                            <Nav.Item>
                                <LinkContainer to="/forecast">
                                    <Nav.Link>
                                        Forecast
                                    </Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                        </Nav>
                        <Nav className="mr-sm-2">
                            <Nav.Item>
                                <LinkContainer to="/about">
                                    <Nav.Link to="/about">
                                        About
                                    </Nav.Link>
                                </LinkContainer>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Route exact path="/" component={MyCalendar}/>
                <Route path="/forecast" component={PlaceHolder}/>
                <Route path="/about" component={PlaceHolder}/>
            </HashRouter>
        )
    };
}

export default App;
