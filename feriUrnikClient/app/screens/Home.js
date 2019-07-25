import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { Card, Text, PricingCard, Icon, CheckBox, Button } from 'react-native-elements';

import { getIzbira, deleteAllIzbira } from '../databases/queries';

import { t } from '../locales/i18n';

class Home extends Component {
    state = {
        izbranPredmetStudent: null,
        izbranLetnikStudent: null,
        izbranaSmerStudent: null,
        izbranIdAsync: '',
        showView: false
    }

    static navigationOptions = {
        headerLeft: null
    }

    componentDidMount() {
        this._getIdIzbraneSkupine();
    }

    onSelect = () => {
        this._getIdIzbraneSkupine();
    };

    _getIdIzbraneSkupine = () => {
        getIzbira()
        .then((result) => {
            if (result != null) {
                this.setState({ izbranPredmetStudent: result.program })
                this.setState({ izbranLetnikStudent: result.letnik })
                this.setState({ izbranaSmerStudent: result.smer })
                this.setState({ izbranIdAsync: result.idSkupine });
                this.setState({ showView: true });
            }
        })
    }

    handleButtonStudent = () => {

        if (this.state.izbranIdAsync !== '') {
            this.props.navigation.navigate('Schedule', { selectedIdAsync: this.state.izbranIdAsync });
        }
        else {
            this.props.navigation.navigate('Student', { onSelect: this.onSelect });
        }
    }

    handleButtonProfessor = () => {
        this.props.navigation.navigate('Professor');
    }

    handleButtonClassrom = () => {
        this.props.navigation.navigate('Classroom');
    }

    _deleteAsyncId = () => {
        deleteAllIzbira()
        .then(() => {
            this.setState({ izbranIdAsync: '', });
            this.setState({ izbranPredmetStudent: null });
            this.setState({ izbranLetnikStudent: null });
            this.setState({ izbranaSmerStudent: null });
            this.setState({ showView: false });
        })
    }

    _showDetails = () => {
        let izbranPredmet = this.state.izbranPredmetStudent;
        let izbranLetnik = this.state.izbranLetnikStudent;
        let izbranaSmer = this.state.izbranaSmerStudent;

        Alert.alert(
            `${t('Home.alertchoicetitle')}`,
            `${t('Home.alertchoicemsg', { izbranPredmet, izbranLetnik, izbranaSmer })}`,
            [
                {
                    text: `${t('Home.alertclose')}`, style: 'cancel'
                },
            ],
            { cancelable: false }
        )
    }

    render() {

        let prikaziText = null;
        if (this.state.showView) {
            prikaziText = (
                <View style={styles.containerPrikazPredmeta} >
                    <View style={styles.texview} >
                        <Text style={styles.textboxPrikazPredmeta}>{t('Home.savedchoice')}</Text>
                    </View>
                    <Icon
                        raised
                        name='information'
                        type='material-community'
                        color='#036384'
                        onPress={this._showDetails} />
                    <Icon
                        raised
                        name='bookmark-remove'
                        type='material-community'
                        color='#f50'
                        onPress={this._deleteAsyncId} />
                </ View>
            )
        }
        return (
            <View style={styles.container} >
                <ScrollView>
                    <Card>
                        <TouchableOpacity onPress={this.handleButtonStudent}>
                            <Icon
                                name='ios-school'
                                type='ionicon'
                                color='#517fa4'
                                size={50}
                            />
                            <Text h4 style={styles.textbox}>
                                {t('Home.students')}
                            </Text>
                        </TouchableOpacity>
                        {prikaziText}
                    </Card>

                    <Card>
                        <TouchableOpacity onPress={this.handleButtonProfessor}>
                            <Icon
                                name='torsos-female-male'
                                type='foundation'
                                color='#517fa4'
                                size={50}
                            />
                            <Text h4 style={styles.textbox}>
                                {t('Home.tutors')}
                            </Text>
                        </TouchableOpacity>
                    </Card>

                    <Card>
                        <TouchableOpacity onPress={this.handleButtonClassrom}>
                            <Icon
                                name='weekend'
                                color='#517fa4'
                                size={50}
                            />
                            <Text h4 style={styles.textbox}>
                                {t('Home.classrooms')}
                            </Text>
                        </TouchableOpacity>
                    </Card>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flexDirection: 'column',
        flex: 1
    },
    textbox: {
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    containerPrikazPredmeta: {
        marginTop: 10,
        flexDirection: 'row',
    },
    texview: {
        flexDirection: 'column',
        width: '60%',
        justifyContent: 'center',
        marginLeft: 10,
    },
    textboxPrikazPredmeta: {
        fontWeight: '500'
    },

});

export default Home;