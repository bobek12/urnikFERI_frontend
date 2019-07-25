import React from 'react';
import { StackNavigator, createSwitchNavigator } from 'react-navigation';

import Home from './screens/Home';
import Student from './screens/Student';
import Professor from './screens/Professor';
import Classrom from './screens/Classroom';
import Schedule from './screens/Schedule';
import Splash from './screens/Splash';

import { t } from './locales/i18n';

const HomeScr = StackNavigator({

    Home: {
        screen: Home, navigationOptions: {
            title: `${t('Navigation.home')}`,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#036384'
            }
        },
    },
    Student: {
        screen: Student, navigationOptions: {
            title: `${t('Navigation.student')}`,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#036384'
            }
        }
    },
    Professor: {
        screen: Professor, navigationOptions: {
            title: `${t('Navigation.professor')}`,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#036384'
            }
        }
    },
    Classroom: {
        screen: Classrom, navigationOptions: {
            title: `${t('Navigation.classroom')}`,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#036384'
            }
        }
    },
    Schedule: {
        screen: Schedule, navigationOptions: {
            title: `${t('Navigation.schedule')}`,
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: '#036384'
            }
        }
    },
})

export const Root = createSwitchNavigator({
    Splash: {
        screen: Splash
    },
    HomeScreen: HomeScr
})




