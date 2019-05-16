import React, { Component } from 'react';
import {createDrawerNavigator} from 'react-navigation'
import TabNavigator from './TabNavigator'
import Login from '../components/User/DangNhap'
import SlideMenu from '../components/SlideMenu'
import Account from '../components/User/Account';
import Setting from '../setting/Setting'

const Drawer = createDrawerNavigator({
    Home: {screen: TabNavigator},
    Login: {screen: Login},
    Account: {screen: Account},
    Setting:{screen:Setting}
},{
    contentComponent: props => <SlideMenu {...props}/>
})

export default Drawer;