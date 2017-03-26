import React, { Component } from 'react';
import { Container, Content, Picker } from 'native-base';

export default class fieldPicker extends Component {

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
                iosHeader="Select a Category"
                mode="dropdown"
                selectedValue={this.state.selected1}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="Chemistry" value="Chemistry" />
                <Picker.Item label="Biology" value="Biology" />
                <Picker.Item label="Physics" value="Physics" />
                <Picker.Item label="Geology" value="Geology" />
                <Picker.Item label="Environmental Science" value="Environmental Science" />
                <Picker.Item label="Mathematics" value="Mathematics" />
                <Picker.Item label="Computer Science" value="Computer Science" />
                <Picker.Item label="Information Systems/Security" value="Information Systems/Security" />
                <Picker.Item label="Mechanical Engineering" value="Mechanical Engineering" />
                <Picker.Item label="Chemical Engineering" value="Chemical Engineering" />
                <Picker.Item label="Biomedical Engineering" value="Biomedical Engineering" />
                <Picker.Item label="Systems Engineering" value="Systems Engineering" />
                <Picker.Item label="Computer Engineering" value="Computer Engineering" />
                <Picker.Item label="Aeuronautical Engineering" value="Aeuronatical Engineering" />
                <Picker.Item label="Nanotechnology" value="Nanotechnology" />
            </Picker>
        );
    }
}