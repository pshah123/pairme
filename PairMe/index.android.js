import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  View,
  Linking
} from 'react-native';
import firebase from 'firebase';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import {
  Grid, Col, Row,
  Form, Input, Item, Spinner, List, ListItem, Separator,
  StyleProvider, Container, Content, Footer, Left, Body, Right, FooterTab, Fab, Button, Icon, Text, Card, CardItem, Thumbnail, H1, H2, H3, H4, H5, H6
} from 'native-base';
import { Header, Title } from 'native-base/backward';
import getTheme from './native-base-theme/components';
import AutoLink from 'react-native-autolink';
import commonColor from './native-base-theme/variables/commonColor';
import ProfileWidget from './src/profile_widget'
import AddButton from './src/addButton'
import AddListing from './src/addListing'

const buildStyleInterpolator = require('buildStyleInterpolator');

var NoTransition = {
  opacity: {
    from: 1,
    to: 1,
    min: 1,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};


const Transitions = {
  NONE: {
    ...Navigator.SceneConfigs.FadeAndroid,
    gestures: null,
    defaultTransitionVelocity: 1000,
    animationInterpolators: {
      into: buildStyleInterpolator(NoTransition),
      out: buildStyleInterpolator(NoTransition)
    }
  }
};

var fcmToken;

var profRef;
var profInfoSet = false;
var profInfo;



var loggedIn = false;
var signedIn = false;

function handleSignIn(user) {
  if (user) {
    loggedIn = true;
    signedIn = true;
    this.setState({});
  } else {
    signedIn = true;
    this.setState({});
  }
}


var sciences = [
  'Chemistry', 'Biology', 'Physics', 'Geology', 'Environmental Science'
]
var maths = [
  'Mathematics', 'Computer Science', 'Information Systems/Security'
]
var engineering = [
  'Mechanical Engineering', 'Chemical Engineering', 'Biomedical Engineering',
  'Systems Engineering', 'Computer Engineering', 'Aeoronautical Engineering',
  'Nanotechnology'
]

export default class PairMe extends Component {

  async getMyPositions(obj) {
    var professors = [];
    var data;
    console.log("Getting snapshot...");
    profRef.once("value", function (snapshot) {
      console.log("Got snapshot.");
      data = snapshot.val();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          professors.unshift({
            name: data[key].name,
            email: data[key].email,
            broader_field: data[key].field,
            research_field: data[key].topic,
            description: data[key].description,
            location: data[key].location,
            times_available: data[key].times_available
          });
        }
      }
      console.log("Got data");
      var refined = []
      var myEmail = firebase.auth().currentUser.email;
      console.log("Got email");
      for (var i = 0; i < professors.length; i++) {
        console.log("Iterating " + professors[i].email);
        if (professors[i].email == myEmail)
          refined.unshift(professors[i]);
      }
      console.log("Refined data");
      var profCards = refined.map((listing, i) =>
        <Card style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }} key={i}>
          <CardItem bordered>
            <Left>
              <Icon name="book" />
              <Body>
                <Text>{listing.research_field.toString()}</Text>
                <Text note>{listing.name.toString()} in {listing.broader_field.toString()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>{listing.description.toString()}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Body>
              <Text>In {listing.location.toString()}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Body>
              <Text style={{ color: '#a8a8a8' }}>{listing.times_available.toString()}</Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Body>
              <AutoLink text={listing.email.toString()} />
            </Body>
          </CardItem>
        </Card>
      );
      console.log("Made cards");
      profInfo = profCards;
      profInfoSet = true;
      obj.setState({});
    });
  }

  async getListings(obj, field) {
    var professors = [];
    var data;
    console.log("Getting snapshot...");
    profRef.once("value", function (snapshot) {
      console.log("Got snapshot.");
      data = snapshot.val();
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          professors.unshift({
            name: data[key].name,
            email: data[key].email,
            broader_field: data[key].field,
            research_field: data[key].topic,
            description: data[key].description,
            location: data[key].location,
            times_available: data[key].times_available
          });
        }
      }
      console.log("Got data");
      var refined = []
      for (var i = 0; i < professors.length; i++) {
        if (professors[i].broader_field == field)
          refined.unshift(professors[i]);
      }
      console.log("Refined data");
      var profCards = refined.map((listing, i) =>
        <Card style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }} key={i}>
          <CardItem bordered>
            <Left>
              <Icon name="book" />
              <Body>
                <Text>{listing.research_field.toString()}</Text>
                <Text note>{listing.name.toString()} in {listing.broader_field.toString()}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Text>{listing.description.toString()}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Body>
              <Text>In {listing.location.toString()}</Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Body>
              <Text style={{ color: '#a8a8a8' }}>{listing.times_available.toString()}</Text>
            </Body>
          </CardItem>
          <CardItem footer>
            <Body>
              <AutoLink text={listing.email.toString()} />
            </Body>
          </CardItem>
          <Button full style={{backgroundColor: "#635DB7"}}
            onPress={() => {
              Linking.openURL('mailto:'+listing.email.toString()+'?subject=I%27d+Like+to+Pair%21&body=Dear+Professor+'+listing.name.toString().replace(' ','+')+'%2C')
            }}>
            <Text>Pair Me Up!</Text>
          </Button>
        </Card>
      );
      console.log("Made cards");
      profInfo = profCards;
      profInfoSet = true;
      obj.setState({});
    });
  }

  constructor(props) {
    super(props);
    try {
      firebase.app();
    }
    catch (e) {
      firebase.initializeApp({
        apiKey: "",
        authDomain: "pairme-c425b.firebaseapp.com",
        databaseURL: "https://pairme-c425b.firebaseio.com",
        storageBucket: "pairme-c425b.appspot.com",
        messagingSenderId: ""
      });
    }
    profRef = firebase.database().ref("professors");
    studentRef = firebase.database().ref("students");
    firebase.auth().onAuthStateChanged(handleSignIn.bind(this));
  }

  render() {
    return (
      <Navigator
        configureScene={(route, stack) => { return Transitions.NONE; }}
        initialRoute={{ index: 2, title: 'Profile' }}
        renderScene={(route, navigator) =>
          <StyleProvider style={getTheme(commonColor)}>
            <Container>
              <Header>
                <Title>{route.title}</Title>
              </Header>

              <Content>
                {(
                  signedIn &&
                  (
                    (route.index == 3 &&
                      this.getListings(this, route.title) &&
                      <View style={{ marginTop: 30 }}>
                        {(profInfoSet && profInfo) || <Spinner style={{ marginTop: 60 }} color="green" />}
                      </View>
                    )
                    ||
                    (route.index == 2 &&
                    (
                      <View>
                        <View>
                          <Left>
                            <Thumbnail style={{ marginTop: 25, marginBottom: 15 }} square source={require('./img/user.jpg')} />
                          </Left>
                          <Body>
                            <H2>Setup Your Profile</H2>
                          </Body>
                          <Right />
                        </View>
                        <Card style={{ marginTop: 15, marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
                          <CardItem bordered>
                            <AutoLink
                              text="By filling out information you agree to our privacy policy found here: http://www.goo.gl/7xmbm6" />
                          </CardItem>
                        </Card>
                        <ProfileWidget submitted={()=>{
                            loggedIn = true;
                          }} style={{ marginTop: 40 }} />
                        <Button onPress={()=>{firebase.auth().signOut().then(()=>{
                          this.setState({});
                          loggedIn = false;
                          navigator.resetTo({index:0, title: 'Profile'})
                          })}} danger block style={{marginLeft:15, marginRight:15, marginTop:20}}><Text>Sign Out</Text></Button>
                      </View>)
                      
                      )
                    ||
                    ((loggedIn && route.index == 0 &&
                      (
                        ((firebase.auth().currentUser.photoURL) == "stud" &&
                          <View style={{ marginTop: 3 }}>
                            <Separator bordered><Text>Sciences</Text></Separator>
                            <List button dataArray={sciences} renderRow={(data) =>
                              <ListItem button onPress={() => {
                                navigator.resetTo({
                                  index: 3,
                                  title: data
                                })
                              }}>
                                <Text>{data}</Text>
                              </ListItem>
                            } />
                            <Separator bordered><Text>Maths</Text></Separator>
                            <List button dataArray={maths} renderRow={(data) =>
                              <ListItem button onPress={() => {
                                navigator.resetTo({
                                  index: 3,
                                  title: data
                                })
                              }}>
                                <Text>{data}</Text>
                              </ListItem>
                            } />
                            <Separator bordered><Text>Engineering</Text></Separator>
                            <List button dataArray={engineering} renderRow={(data) =>
                              <ListItem button onPress={() => {
                                navigator.resetTo({
                                  index: 3,
                                  title: data
                                })
                              }}>
                                <Text>{data}</Text>
                              </ListItem>
                            } />
                          </View>
                        )
                        ||
                        ((firebase.auth().currentUser.photoURL) == "prof" &&
                          this.getMyPositions(this) &&
                          <View>
                            <AddButton pressed={() => {
                              navigator.resetTo({ index: 1, title: 'Create New Listing' });
                            }} />
                            {(profInfoSet && profInfo) || <Spinner style={{ marginTop: 60 }} color="green" />}
                          </View>
                        )
                        ||
                        (<Text>Something is wrong.</Text>)
                      )
                    )
                    
                    ||
                    (route.index == 1
                      &&
                      <AddListing addListing={(topic, field, description, times_available, location) => {
                        var user;
                        if ((user = firebase.auth().currentUser) != null) {
                          var listingRef = firebase.database().ref("professors/" + topic + user.displayName.replace('.', ''));
                          listingRef.push();
                          listingRef.set({
                            'name': user.displayName,
                            'email': user.email,
                            'topic': topic,
                            'field': field,
                            'description': description,
                            'location': location,
                            'times_available': times_available
                          })
                          this.getMyPositions(this);
                          navigator.resetTo({ index: 0, title: 'Current Listings' });
                        }
                      }} />
                    )
                    ||
                    <Text style={{marginTop:20, marginLeft:20, marginRight:20}}>Please Sign In from the profile tab.</Text>
                    )
                  )
                )
                  ||
                  <Spinner style={{ marginTop: 60 }} color="green" />
                }
              </Content>

              <Footer>
                <FooterTab>
                  <Button onPress={() => { navigator.resetTo({ index: 0, title: 'Current Listings' }) }}>
                    {(route.index == 0 && <Icon name="ios-paper" />) || (<Icon name="ios-paper-outline" />)}
                  </Button>
                  <Button onPress={() => { navigator.resetTo({ index: 2, title: 'Profile' }) }} >
                    {(route.index == 2 && <Icon name="ios-contact" />) || (<Icon name="ios-contact-outline" />)}
                  </Button>
                </FooterTab>
              </Footer>
            </Container>
          </StyleProvider>
        } />
    );
  }
}

AppRegistry.registerComponent('PairMe', () => PairMe);
