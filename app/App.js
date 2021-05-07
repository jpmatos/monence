import React from "react";
import MyNavbar from './components/content/MyNavbar'
import CalendarContext from "./components/context/CalendarContext";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarLoaded: false
        }
    }

    componentDidMount() {
        this.context.setCalendar('01')  //TODO change to user calendar
        this.context.getCalendar()
            .then(() => {
                this.setState({calendarLoaded: true})
            })
    }

    render() {
        return (
            <div>
                {this.state.calendarLoaded ? <MyNavbar/> : null}
            </div>
        )
    };
}

App.contextType = CalendarContext

export default App;
