import React, { Component } from 'react';
import { Container, Content, Button, Icon, Fab, View, Text } from 'native-base';

export default class AddButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true
        };
    }

    render() {
        return ( 
        <Button onPress={this.props.pressed} primary block style={{marginTop:30, marginLeft: 15, marginRight: 15}}>
            <Text>Add New Listing</Text>
        </Button>
        );
    }
}