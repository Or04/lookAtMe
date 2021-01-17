import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import ServerApi from '../modules/ServerApi'







class timer {
    constructor() {
        this.sendLocation = true
        this.intervalID = false
        this.userEmail = false
    }

    setError = (f) => {
        this.error = f
    }
    getPermissionsStatus = async () => {



        let permissionsFlag = false
        for (let i = 0; i < 3; i++) {
            let getPermissionsResponed = await Permissions.getAsync(
                Permissions.LOCATION
            )
            if (typeof getPermissionsResponed.status != 'undefined' && (getPermissionsResponed.status == 'granted' || getPermissionsResponed.status == 'undetermined')) {
                if (typeof getPermissionsResponed.permissions != 'undefined' &&
                    typeof getPermissionsResponed.permissions.location != 'undefined' &&
                    typeof getPermissionsResponed.permissions.location.status != 'undefined' &&
                    getPermissionsResponed.permissions.location.status == 'granted') {
                    permissionsFlag = true
                }
            }
        }
        return permissionsFlag
    }

    askLocationPermissions = async () => {
        let askPermissionsResponed = await Permissions.askAsync(
            Permissions.LOCATION
        )
    }

    getSendLocationStatus = () => {
        return this.sendLocation
    }

    disableSendLocation = () => {
     
        if (this.intervalID) {
            clearInterval(this.intervalID)
            return true
        }
        return false
    }
    activeSendLocation = (userEmail) => {
        if (userEmail) {
            if (this.intervalID) {
                clearInterval(this.intervalID)
            }
            this.userEmail = userEmail
            let intervalID = setInterval(async () => {
                try {
                    let locationResponed = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
                    if (this.userEmail) {
                        let sendUserLocationResponed = await ServerApi.sendUserLocation(this.userEmail, locationResponed.coords.latitude, locationResponed.coords.longitude)
                    }
                } catch (error) {
                    this.error(error)
                }
            }, 1000);
            this.intervalID = intervalID
            return true
        } else {
            return false
        }

    }
    getIntervalID = () => {
        return this.intervalID
    }



}



let t = new timer()

export default t