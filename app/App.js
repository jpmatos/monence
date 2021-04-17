import React, {Component} from "react";
import MyNavbar from './components/MyNavbar';
import MyCalendar from "./components/MyCalendar";
import Container from "react-bootstrap/Container";

// import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <MyNavbar/>
                <Container style={{ height: 800 }}>
                    <MyCalendar/>
                </Container>
            </div>
        )
    };
}

export default App;
