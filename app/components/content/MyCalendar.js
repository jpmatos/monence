import React from 'react'
import moment from 'moment'
import axios from 'axios'

import Container from '@material-ui/core/Container'

import {Calendar} from 'react-big-calendar'
import {momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import FloatingActionButton from '../FloatingActionButton'
import CreateItemFormDialog from '../forms/CreateItemFormDialog'
import UpdateItemFormDialog from '../forms/UpdateItemFormDialog'

moment.locale('en')
const localizer = momentLocalizer(moment)

export default class MyCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNewItemFDOpen: false,
            isItemFDOpen: false,
            items: [],
            currentlyOpenItem: {}
        }
    }

    handleClickOpen = () => {
        this.setState({isNewItemFDOpen: true})
    }
    handleNewItem = (item) => {
        this.state.items.push(item)
    }
    handleDeleteItem = (id) => {
        const itemIdx = this.state.items.findIndex(i => i.id === id)
        if (itemIdx !== -1)
            this.state.items.splice(itemIdx, 1)
    }
    handleUpdateItem = (item) => {
        const itemIdx = this.state.items.findIndex(i => i.id === item.id)
        if (itemIdx !== -1)
            this.state.items[itemIdx] = item
    }

    onClickItem = (item) => {
        this.setState({
            currentlyOpenItem: item,
            isItemFDOpen: true
        })
    }

    setNewItemFD = (event) => {
        this.setState({isNewItemFDOpen: event})
    }

    setItemFD = (event) => {
        this.setState({isItemFDOpen: event})
    }

    componentDidMount() {
        //Disable calendar
        axios.get('/calendar/01')
            .then(res => {
                const calendar = res.data
                this.setState({items: calendar.expenses})       //TODO join with gains
                //Enable
            })
            .catch(err => {
                //Inform user server did not respond
            })
    }

    render() {
        return (
            <Container style={{height: 800}}>
                <Calendar
                    localizer={localizer}
                    events={this.state.items}
                    startAccessor='start'
                    endAccessor='end'
                    onSelectEvent={this.onClickItem}
                />
                <FloatingActionButton handleOnClickFAB={this.handleClickOpen}/>
                <CreateItemFormDialog isOpen={this.state.isNewItemFDOpen} setOpen={this.setNewItemFD}
                                      handleNewItem={this.handleNewItem}/>
                <UpdateItemFormDialog isOpen={this.state.isItemFDOpen} setOpen={this.setItemFD}
                                      currentlyOpenItem={this.state.currentlyOpenItem}
                                      handleDeleteItem={this.handleDeleteItem}
                                      handleUpdateItem={this.handleUpdateItem}/>
            </Container>
        )
    }
}