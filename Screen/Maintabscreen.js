import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import DetailsScreen from './DetalisScreen';
import ProfileScreen from './ProfileScreen';
import Ridelist from './Ridelist';

import Icon from 'react-native-vector-icons/Ionicons';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from './utils/colors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const HomeStack = createNativeStackNavigator();
const DetailsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const RideStack = createNativeStackNavigator();
// const Leaderborad = createStackNavigator();

const Tab = createBottomTabNavigator();

const Maintabscreen = () => (
  <Tab.Navigator
    initialRouteName="Home"
    activeColor={colors.white}
    tabBarOptions={{
      activeBackgroundColor: colors.white,
      inactiveBackgroundColor: colors.white,
      activeTintColor: colors.lightred,
      inactiveTintColor: colors.black,
    }}>
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Home',
        tabBarColor: colors.white,
        tabBarIcon: ({color}) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Ridelist"
      component={RideStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Rides',
        tabBarColor: colors.darkThemeColor,
        tabBarIcon: ({color}) => (
          <MaterialCommunityIcons name="bike" color={color} size={26} />
        ),
      }}
    />

    <Tab.Screen
      name="Notifications"
      component={DetailsStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'History',
        tabBarColor: colors.darkThemeColor,
        tabBarIcon: ({color}) => (
          <Icon name="ios-notifications" color={color} size={26} />
        ),
      }}
    />
    {/* <Tab.Screen
      name="Leaderborad"
      component={LeaderboradStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Leaderborad',
        tabBarColor: colors.darkThemeColor,
        tabBarIcon: ({color}) => (
          <AntDesign name="table" color={color} size={26} />
        ),
      }}
    /> */}

    <Tab.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Profile',
        tabBarColor: colors.darkThemeColor,
        tabBarIcon: ({color}) => (
          <Icon name="ios-person" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default Maintabscreen;

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colors.black,
      },
    }}>
    <HomeStack.Screen
      name="Homes"
      component={HomeScreen}
      options={{
        title: 'Home',
        headerLeft: () => null,
      }}
    />
  </HomeStack.Navigator>
);

const RideStackScreen = ({navigation}) => (
  <RideStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: colors.black,
      },
    }}>
    <RideStack.Screen
      name="Rides"
      component={Ridelist}
      options={{
        title: 'Rides',
        headerLeft: () => null,
      }}
    />
  </RideStack.Navigator>
);

const DetailsStackScreen = ({navigation}) => (
  <DetailsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerTintColor: '#fff',

      headerTitleStyle: {
        fontWeight: 'bold',
        color: colors.black,
      },
    }}>
    <DetailsStack.Screen
      name="Detalis"
      component={DetailsScreen}
      options={{headerLeft: () => null}}
    />
  </DetailsStack.Navigator>
);
const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: colors.white,
      },
      headerTintColor: '#fff',

      headerTitleStyle: {
        fontWeight: 'bold',
        color: colors.black,
      },
    }}>
    <ProfileStack.Screen
      name="profiles"
      component={ProfileScreen}
      options={{
        title: 'Profile',

        headerLeft: () => null,
      }}
    />
  </ProfileStack.Navigator>
);

// const LeaderboradStackScreen = ({navigation}) => (
//   <Leaderborad.Navigator
//     screenOptions={{
//       headerStyle: {
//         backgroundColor: colors.black,
//       },
//       headerTintColor: '#fff',

//       headerTitleStyle: {
//         fontWeight: 'bold',
//       },
//     }}>
//     <Leaderborad.Screen
//       name="Leaderborad"
//       component={leaderboradScreen}
//       options={{
//         title: 'Leaderborad',

//         headerLeft: () => null,
//       }}
//     />
//   </Leaderborad.Navigator>
// );
