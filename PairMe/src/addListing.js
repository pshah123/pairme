import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  View
} from 'react-native';
import firebase from 'firebase';
import { 
  Form, Input, Item, Label,
  Left, Body, Right, Button, Icon, Text, Card, CardItem, Thumbnail, H1, H2, H3} from 'native-base';
import AutoLink from 'react-native-autolink';
import FieldPicker from './fieldPicker.js'

var firstTime = false;
export default class AddListing extends Component {
    constructor(props){
        super(props);
        this.state={
            topic: 'Topic',
            field: 'Biology',
            description: 'Description',
            location: 'Over the Rainbow, North Pole',
            times_available: 'Weekends, 10am-3pm'
        }
    }
    render() {
        return(
            <Form>
                <Item style={{marginTop:20, marginBottom:0}}>
                <Label>Field of Significance</Label>
                </Item>
                <FieldPicker style={{marginTop:0, marginBottom:15, marginLeft:15}}
                selectedType={this.state.field}
                onChanged={(value)=>{
                        this.setState({topic: this.state.topic, field: value, description: this.state.description, location: this.state.location, times_available: this.state.times_available});
                }} />
                <Item style={{marginTop:20}}><Label>Research Information</Label></Item>
                <Item success style={{marginTop:10}}>
                    <Input placeholder={this.state.topic} onChangeText={(text)=>{
                        this.setState({topic: text, field: this.state.field, description: this.state.description, location: this.state.location, times_available: this.state.times_available});
                    }} />
                </Item>
                <Item underline>
                    <Input placeholder={this.state.description} multiline={true} style={{height:130}} numberOfLines={20} onChangeText={(text)=>{
                        this.setState({topic: this.state.topic, field: this.state.field, description: text, location: this.state.location, times_available: this.state.times_available});
                    }} />
                </Item>
                <Item underline>
                    <Input placeholder={this.state.location} onChangeText={(text)=>{
                        this.setState({topic: this.state.topic, field: this.state.field, description: this.state.description, location: text, times_available: this.state.times_available});
                    }} />
                </Item>
                <Item underline>
                    <Input placeholder={this.state.times_available} onChangeText={(text)=>{
                        this.setState({topic: this.state.topic, field: this.state.field, description: this.state.description, location: this.state.location, times_available: text});
                    }} />
                </Item>
                <Button block primary style={{marginTop: 30, marginLeft: 15, marginRight: 15}}
                onPress={()=>{this.props.addListing(this.state.topic, this.state.field, this.state.description, this.state.times_available, this.state.location)}}>
                    <Text>Submit Listing</Text>
                </Button>
                <Text style={{marginTop:30, marginLeft:20, marginRight:20}}>Your email will be included with the listing as a contact method.</Text>
            </Form>
        )
    }
}