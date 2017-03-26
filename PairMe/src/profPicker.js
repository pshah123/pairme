import React, { Component } from 'react';
import { Container, Content, Picker } from 'native-base';

export default class ProfPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: undefined,
            selected1: this.props.selectedType,
            results: {
                items: []
            }
        }
    }
    onValueChange(value) {
        this.props.onChanged(value);
        this.setState({
            selected1: value
        });
    }

    render() {
        return (
            <Picker style={{marginLeft:15, marginTop:15}}
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selected1}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="I'm a Professor!" value="prof" />
                <Picker.Item label="I'm a Student!" value="stud" />
            </Picker>
        );
    }
}