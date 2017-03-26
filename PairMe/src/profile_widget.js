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
    Left, Body, Right, Button, Icon, Text, Card, CardItem, Thumbnail, H1, H2, H3
} from 'native-base';
import AutoLink from 'react-native-autolink';
import ProfPicker from './profPicker.js';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

var firstTime = false;
export default class ProfileWidget extends Component {
    constructor(props) {
        super(props);
        var user = firebase.auth().currentUser;
        firstTime = false;
        this.state = { name: 'Name', email: 'example@example.com', type: 'stud' }
        if (user == null || user.displayName == null) {
            firstTime = true;
            this.state = { name: 'Name', email: 'example@example.com', type: 'stud' };
        }
        else this.state = { name: user.displayName, email: user.email, type: user.photoURL };
    }
    render() {
        return (
            <Form>
                <Item success style={{ marginTop: 20 }}>
                    <Input placeholder={(this.state.name != null && this.state.name) || ("Name")} onChangeText={(text) => { this.setState({ name: text, email: this.state.email, type: this.state.type }) }} />
                </Item>
                {(firstTime &&
                    <Item success style={{ marginTop: 20 }}>
                        <Input placeholder={(this.state.email != null && this.state.email) || ("Email")} onChangeText={(text) => { this.setState({ name: this.state.name, email: text, type: this.state.type }) }} />
                    </Item>) ||
                    <Item disabled style={{ marginTop: 20 }}>
                        <Input disabled placeholder={(this.state.email)} />
                        <Icon name="lock" />
                    </Item>}
                <ProfPicker style={{ marginTop: 15, marginLeft: 15 }} selectedType={this.state.type} onChanged={(value) => { this.setState({ name: this.state.name, email: this.state.email, type: value }) }} />
                
                { (this.state.type=="stud") && (<View>
                <Item success style={{ marginTop: 20 }}>
                    <Input placeholder={("GPA")} />
                </Item>
                    <Item underline>
                    <Input placeholder={("Describe your research interests.")} multiline={true} style={{ height: 130 }} numberOfLines={20} />
                </Item>
                <Item style={{ marginTop: 20, marginBottom: 0 }}>
                    <Label>Notable Accomplishments/Activities</Label>
                </Item>
                <Item success style={{ marginTop: 20 }}>
                    <Input placeholder={("1. Most notable")} />
                </Item>
                <Item success style={{ marginTop: 20 }}>
                    <Input placeholder={("2. 2nd most notable")} />
                </Item>
                <Item success style={{ marginTop: 20 }}>
                    <Input placeholder={("3. 3rd most notable")} />
                </Item></View>)
                }
                <Button style={{ marginTop: 15, marginLeft: 20, marginRight: 20 }} onPress={() => {
                    if (firebase.auth().currentUser != null && firebase.auth().currentUser.isAnonymous)
                        firebase.auth().signOut().then(() => {
                            try {
                                firebase.auth().createUserWithEmailAndPassword(this.state.email, 'priansh123$').then(() => {
                                    firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type }).then(
                                        () => {
                                            this.setState({ name: this.state.name, email: this.state.email });
                                        }
                                    );
                                }).catch(function (e) { });
                                firebase.auth().signInWithEmailAndPassword(this.state.email, 'priansh123$').then(() => {
                                    firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type }).then(
                                        () => {
                                            this.setState({ name: this.state.name, email: this.state.email });
                                        }
                                    );
                                }).catch(function (e) { })
                            }
                            catch (e) {
                                firebase.auth().signInWithEmailAndPassword(this.state.email, 'priansh123$').then(() => {
                                    firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type }).then(
                                        () => {
                                            this.setState({ name: this.state.name, email: this.state.email });
                                        }
                                    );
                                })
                            }
                        });
                    else if (firebase.auth().currentUser != null)
                        firebase.auth().currentUser.updateEmail(this.state.email).then(() => {
                            firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type });
                        });
                    else {
                        try {
                            firebase.auth().createUserWithEmailAndPassword(this.state.email, 'priansh123$').then(() => {
                                firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type }).then(
                                    () => {
                                        this.setState({ name: this.state.name, email: this.state.email });
                                    }
                                );
                            }).catch(function (e) { });
                            firebase.auth().signInWithEmailAndPassword(this.state.email, 'priansh123$').then(() => {
                                firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type }).then(
                                    () => {
                                        this.setState({ name: this.state.name, email: this.state.email });
                                    }
                                );
                            }).catch(function (e) { })
                        }
                        catch (e) {
                            firebase.auth().signInWithEmailAndPassword(this.state.email, 'priansh123$').then(() => {
                                firebase.auth().currentUser.updateProfile({ displayName: this.state.name, photoURL: this.state.type }).then(
                                    () => {
                                        this.setState({ name: this.state.name, email: this.state.email });
                                    }
                                );
                            })
                        }
                    }
                    this.props.submitted();
                }} block primary><Text>Save</Text></Button>
            </Form>
        )
    }
}