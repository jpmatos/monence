import React from 'react'
import moment from 'moment'
import axios from 'axios'

import Container from '@material-ui/core/Container'

import {Calendar} from 'react-big-calendar'
import {momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {red} from '@material-ui/core/colors';
import {green} from '@material-ui/core/colors';

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
                this.setState({items: calendar.expenses.concat(calendar.gains)})       //TODO join with gains
                //Enable
            })
            .catch(err => {
                //Inform user server did not respond
            })
    }

    eventStyleGetter(event, start, end, isSelected){
        let backgroundColor = '#' + event.hexColor;
        switch (event.type){
            case 'expense':
                backgroundColor = red[500]
                break
            case 'gain':
                backgroundColor = green[500]
                break
        }
        return {
            style: {
                backgroundColor: backgroundColor,
                borderRadius: '0px',
                opacity: 0.8,
                border: '0px',
                display: 'block'
            }
        };
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
                    eventPropGetter={this.eventStyleGetter}
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