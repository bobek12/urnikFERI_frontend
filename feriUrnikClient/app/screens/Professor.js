import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Card, Button, Text, SearchBar, Icon, List, ListItem } from 'react-native-elements';

import { t } from '../locales/i18n';

class Professor extends Component {

    state = {
        arrayPredavatelji: [],
        searchPredavatelji: ''
    }

    componentDidMount() {
        this._getPredavateljiFetch();
    }
    componentWillUnmount() { }

    _getPredavateljiFetch = () => {
        fetch('https://feriurnik.herokuapp.com/predavatelji')
            .then(response => response.json()).then(data => {

                const newPolje = data.map(z => {
                    return {
                        predavatelj_id: z.predavatelj_id, ime: z.ime, priimek: z.priimek, email: z.email
                    }
                })
                this.setState({ arrayPredavatelji: newPolje });
            }).catch(error => {
                console.log(error);
            })
    }

    _getUrnikProfessor = (selectedProfesorId) => {
        this.props.navigation.navigate('Schedule', { selectedProfessor: selectedProfesorId });
    }

    _onTextChange = (value) => {
        let lowerCaseCrke = value.toLowerCase();
        this.setState({ searchPredavatelji: lowerCaseCrke });
    }

    render() {

        const filteredArray = this.state.arrayPredavatelji.filter((p) => {
            let name = p.priimek + ' ' + p.ime;
            return name.toLowerCase().indexOf(this.state.searchPredavatelji) !== -1;
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
                    placeholder={t('Professor.search')} />
                <ScrollView>
                    <List containerStyle={{ marginBottom: 20 }}>
                        <FlatList
                            data={filteredArray}
                            renderItem={({ item }) => (
                                <ListItem
                                    leftIcon={<Icon name={'person'} size={14} reverse color={'#036384'} />}
                                    key={item.predavatelj_id}
                                    title={item.priimek + ' ' + item.ime}
                                    onPress={() => { this._getUrnikProfessor(item.predavatelj_id) }}
                                />)}
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

export default Professor;