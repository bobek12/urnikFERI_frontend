import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, ActivityIndicator, Image } from 'react-native';
import { Card, Button, Text, SearchBar, Icon, List, ListItem } from 'react-native-elements';

class Splash extends Component {

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate('Home');
        }, 1000);

    }

    render() {
        return (
            <View style={styles.container}>        
            <Image
                resizeMode="contain"
                style={styles.logo}
                source={require('../img/FERIurnik_logo.jpg')}
            />                       
            <ActivityIndicator size="large" />
        </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#006385',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: '80%'
    }
});

export default Splash;