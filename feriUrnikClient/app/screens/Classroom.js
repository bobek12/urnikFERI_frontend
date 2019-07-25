import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Card, Button, Text, SearchBar, Icon, List, ListItem } from 'react-native-elements';

import { t } from '../locales/i18n';

class Classroom extends Component {
    state = {
        arrayProstori: [],
        searchProstori: '',
    }

    componentDidMount() {
        this._getProstoriFetch();
    }
    componentWillUnmount() { }

    _getProstoriFetch = () => {
        fetch('https://feriurnik.herokuapp.com/prostori')
            .then(response => response.json()).then(data => {
                const newPolje = data.map(z => {
                    return z
                })
                this.setState({ arrayProstori: newPolje });
            }).catch(error => {
                console.log(error);
            })
    }

    _getUrnikProstor = (selectedClass) => {
        this.props.navigation.navigate('Schedule', { selectedClassrom: selectedClass });
    }

    _onTextChange = (value) => {
        let lowerCaseCrke = value.toLowerCase();
        this.setState({ searchProstori: lowerCaseCrke });

    }

    render() {
        const filteredArray = this.state.arrayProstori.filter((p) => {
            return p.toLowerCase().indexOf(this.state.searchProstori) !== -1;
        })

        return (
            <View style={styles.container} >
                <SearchBar
                    containerStyle={{ backgroundColor: "white" }}
                    inputStyle={{ backgroundColor: "white" }}
                    lightTheme
                    showLoading
                    cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
                    onChangeText={(value) => this._onTextChange(value)}
                    placeholder={t('Classrooms.search')} />
                <ScrollView>
                    <List containerStyle={{ marginBottom: 20 }}>

                        <FlatList
                            data={filteredArray}
                            renderItem={({ item }) => (
                                <ListItem
                                    roundAvatar
                                    leftIcon={<Icon name={'weekend'} size={14} reverse color={'#FFC609'} />}
                                    key={item}
                                    title={item}
                                    onPress={() => { this._getUrnikProstor(item) }}
                                />
                            )}
                        />

                    </List>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
});

export default Classroom;