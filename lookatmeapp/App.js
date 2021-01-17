//setstate
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  I18nManager,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import LogInNavigator from './navigation/LogInNavigator'
import Menu from './components/Menu'
import MenuOption from './constants/MenuOption'
import UserTypeNavigator from './navigation/UserTypeNavigator'
import DigitalBoardsNavigator from './navigation/DigitalBoardsNavigator'
import AdministratorNavigator from './navigation/AdministratorNavigator'
import CitiesNavigator from './navigation/CitiesNavigator'
import PremiumUserNavigator from './navigation/PremiumNavigator'
import AdvertiserAdsNavigator from './navigation/AdvertiserAdsNavigator'
import ConsumerNavigator from './navigation/ConsumerNavigator'
import ConsumerAdsNavigator from './navigation/ConsumerAdsNavigator'
import Error from './components/Error'
import timer from './modules/timer'


import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
let userEmailLocation = false



const location = async (data) => {
  try {
    if (typeof data.latitude != 'undefined' && typeof data.longitude != 'undefined' && userEmailLocation != false) {
      let response = await fetch('http://lookatmeil.com/senduserlocation', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          latitude: data.latitude,
          longitude: data.longitude
        })
      })
    }

  } catch (e) {
    console.log(e)
  }
}


const setUpTask = async (taskName, functionPointer) => {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      TaskManager.defineTask(taskName, functionPointer)
    }
    await Location.startLocationUpdatesAsync(taskName, { accuracy: Location.Accuracy.Highest })
  } catch (e) {
    console.log('there was a problem : ' + e.toString())
  }

}
setUpTask('location', location)


export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      isConnected: false,
      menuOption: false,
      userEmail: false,
      userType: false,
      error: false,
      intervalID: false,
      locationPermissionStatus: false,
      sendLocationStatus: false,
      displayMenu: true

    }
    I18nManager.forceRTL(false);
    I18nManager.allowRTL(false);
    I18nManager.swapLeftAndRightInRTL(false)
    this.mountFlag = true
  }

  setUserType = async (type) => {
    if (this.mountFlag) {
      await new Promise(resolved => {
        this.setState({
          userType: type
        }, () => resolved())
      })
    }
  }

  displayMenu = (bool) => {
    this.setState({
      displayMenu: bool
    })
  }

  connectUser = (userEmail) => {
    userEmailLocation = userEmail
    if (this.mountFlag) {
      this.setState({
        isConnected: true,
        userEmail: userEmail,
        menuOption: MenuOption.USERINFO,
        sendLocationStatus: false
      })
    }
  }


  logError = (error) => {
    if (this.mountFlag) {
      this.setState({
        error: error.toString()
      })
    }
  }

  async componentDidMount() {



    this.keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
      if (this.mountFlag) {
        this.setState({
          displayMenu: false
        })
      }

    })
    this.keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      if (this.mountFlag) {

        this.setState({
          displayMenu: false
        })

      }
    })
    this.keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      if (this.mountFlag) {
        this.setState({
          displayMenu: true
        })
      }
    })
    this.keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      if (this.mountFlag) {
        this.setState({
          displayMenu: true
        })
      }
    })

    timer.setError(this.logError)
    this.getLocationPermissions()
  }

  componentDidUpdate() {
    if (!this.state.sendLocationStatus) {
      timer.disableSendLocation()
    }
  }

  disableSendLocation = async () => {
    try {
      if (await timer.disableSendLocation()) {
        if (this.mountFlag) {
          this.setState({
            sendLocationStatus: false
          })
        }
      }
    } catch (error) {
      if (this.mountFlag) {
        this.setState({
          error: error.toString(),
        })
      }
    }

  }

  activeSendLocation = async () => {
    try {
      if (this.state.locationPermissionStatus) {
        let res = timer.activeSendLocation(this.state.userEmail)
        if (this.mountFlag && res) {
          this.setState({
            sendLocationStatus: true
          })
        }
      }
    } catch (error) {
      if (this.mountFlag) {
        this.setState({
          error: error.toString(),
        })
      }
    }
  }

  askLocationPermissions = async () => {
    try {
      await timer.askLocationPermissions()
      let locationStatus = await timer.getPermissionsStatus()
      if (this.mountFlag) {
        this.setState({
          locationPermissionStatus: locationStatus
        })
      }
    } catch (error) {
      if (this.mountFlag) {
        this.setState({
          error: error.toString(),

        })
      }
    }

  }

  componentDidUpdate() {

  }


  getLocationPermissions = async () => {
    try {

      let locationStatus = await timer.getPermissionsStatus()
      if (this.mountFlag) {
        this.setState({
          locationPermissionStatus: locationStatus
        })
      }
    } catch (error) {
      if (this.mountFlag) {
        this.setState({
          error: error.toString(),

        })
      }
    }

  }

  componentWillUnmount() {
    timer.disableSendLocation()
    this.mountFlag = false

    if (typeof this.keyboardWillShow != 'undefined') {
      this.keyboardWillShow.remove()
    }

    if (typeof this.keyboardDidShow != 'undefined') {
      this.keyboardDidShow.remove()
    }
    if (typeof this.keyboardWillHid != 'undefined') {
      this.keyboardWillHid.remove()
    }
    if (typeof this.keyboardDidHide != 'undefined') {
      this.keyboardDidHide.remove()
    }


  }



  getPage = () => {
    if (!this.state.isConnected) {
      return <LogInNavigator
        screenProps={{
          app: this,
          connectUser: this.connectUser,
          displayMenu: this.displayMenu
        }}
      />
    } else if (this.state.menuOption) {
      switch (this.state.menuOption) {
        case MenuOption.USERINFO:
          return <UserTypeNavigator
            screenProps={{
              app: this,
              locationPermissionStatus: this.state.locationPermissionStatus,
              askLocationPermissions: this.askLocationPermissions,
              disableSendLocation: this.disableSendLocation,
              activeSendLocation: this.activeSendLocation,
              sendLocationStatus: this.state.sendLocationStatus,
              userEmail: this.state.userEmail,
              userType: this.state.userType,
              setUserType: this.setUserType
            }} />
          break
        case MenuOption.CATEGORIES:
          return <AdministratorNavigator screenProps={{ app: this }} />
          break
        case MenuOption.DIGITALBOARDS:
          return <DigitalBoardsNavigator screenProps={{ app: this }} />
          break
        case MenuOption.CITIES:
          return <CitiesNavigator screenProps={{ app: this }} />
          break
        case MenuOption.PREMIUM:
          return <PremiumUserNavigator screenProps={{ app: this }} />
          break
        case MenuOption.ADVERTISERADVERTISEMENTS:
          return <AdvertiserAdsNavigator
            screenProps={{
              app: this,
              displayMenu: this.displayMenu
            }}

          />
          break
        case MenuOption.SEARCHADVERTISEMENTS:
          return <ConsumerNavigator
            screenProps={{
              app: this,
              userEmail: this.state.userEmail
            }}
          />
          break
        case MenuOption.CONSUMERADVERTISEMENTS:
          return <ConsumerAdsNavigator screenProps={{ app: this }} />
          break

        default:
          return <Text>menu options not found</Text>
      }
    } else {
      return <Text>not defined</Text>
    }

  }

  render() {
    return (
      <View style={styles.wrapper}>
        {this.getPage()}
        {this.state.displayMenu ?
          <Menu app={this}
            isConnected={this.state.isConnected}
            userEmail={this.state.userEmail}
            userType={this.state.userType}
          />
          :
          null
        }

        {this.state.error ?
          <TouchableOpacity
            onPress={() => {
              if (this.mountFlag) {
                this.setState({
                  error: false
                })
              }
            }}

          >
            <Error errorText={this.state.error} />
          </TouchableOpacity>
          : null}
      </View>
    )
  }
}




const styles = StyleSheet.create({
  wrapper: {
    direction: Platform.OS == 'ios' ? 'rtl' : null,
    marginTop: 0,
    flex: 1,
    backgroundColor: '#fff',
  }
});




