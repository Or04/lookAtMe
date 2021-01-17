import { createStackNavigator } from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'


import CategoriesScreen from '../screens/Administrator/CategoriesScreen'


const AdministratorNavigator = createStackNavigator({
    Categories:CategoriesScreen
})



export default createAppContainer(AdministratorNavigator)