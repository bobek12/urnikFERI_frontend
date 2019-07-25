import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, Dimensions, NetInfo, BackHandler } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';

import UrnikCard from '../components/UrnikCard'

import { getIzbira, insertUrnik } from '../databases/queries';

import { t } from '../locales/i18n';

class Schedule extends Component {

    constructor() {
        super()
        this.backAndroid = this.backAndroid.bind(this)

        this.state = {
            arrayUrnik: [],
            arraySortiranForPortraitDay: [],
            dateTime: new Date,
            dateWeek: '',
            dimensionMode: '',
            arrayMo: [],
            arrayTu: [],
            arrayWe: [],
            arrayTh: [],
            arrayFr: [],
            isConnected: '',
            selectedWithoutSaving: '',
        }
    }
    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            let jePovezava = isConnected ? true : false;
            this.setState({ isConnected: jePovezava });
        });
        this._getPropsFromNavigation();
    }

    componentWillMount() {
        this._onLayoutChange();
        BackHandler.addEventListener('hardwareBackPress', this.backAndroid);

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backAndroid);
    }

    backAndroid = () => {
        this.props.navigation.navigate('Home');
        return true;
    }

    _onLayoutChange = () => {
        const { width, height } = Dimensions.get('window')

        if (width > height) {
            this.setState({ dimensionMode: 'Landscape' });
        } else {
            this.setState({ dimensionMode: 'Portrait' });
        }
    }

    _getPropsFromNavigation = () => {
        const { navigation } = this.props;
        let classromId = navigation.getParam('selectedClassrom');
        let professor_id = navigation.getParam('selectedProfessor');
        let selectedSmer_id = navigation.getParam('selectedSkupina');
        let selectedSmer_id_Save = navigation.getParam('selectedSkupinaSave');
        let selectedSmerAsyncId = navigation.getParam('selectedIdAsync');

        let selectedSmer = ''

        if (typeof (selectedSmer_id) !== 'undefined') {
            selectedSmer = selectedSmer_id;
        } else if (typeof (selectedSmer_id_Save) !== 'undefined') {
            selectedSmer = selectedSmer_id_Save;
        } else if (typeof (selectedSmerAsyncId) !== 'undefined') {
            selectedSmer = selectedSmerAsyncId;
        }

        let urnikPropCheckSelected = '';
        urnikPropCheckSelected = this._checkNavigationProp(classromId, professor_id, selectedSmer);

        if (typeof (classromId) !== 'undefined' || typeof (professor_id) !== 'undefined' || typeof (selectedSmer_id) !== 'undefined') {
            this.setState({ selectedWithoutSaving: true })
            this._getFetchUrnik(urnikPropCheckSelected);
        } else if (typeof (selectedSmer_id_Save) !== 'undefined') {
            this._getFetchUrnik(urnikPropCheckSelected);
        } else if (typeof (selectedSmerAsyncId) !== 'undefined') {
            this._getAsyncUrnik(urnikPropCheckSelected);
        }
    }

    _checkNavigationProp = (classromTitle, professor_id, selectedSmer_id) => {
        let urnikLink = ''
        if (typeof (classromTitle) !== 'undefined') {
            urnikLink = 'https://feriurnik.herokuapp.com/urnikiProstori?prostor=' + classromTitle;
        } else if (typeof (professor_id) !== 'undefined') {
            urnikLink = 'https://feriurnik.herokuapp.com/urnikiPredavatelji?predavatelj=' + professor_id;
        } else if (selectedSmer_id.length !== 0) {
            const newSelectedIdSmer = selectedSmer_id.map(Number);
            urnikLink = 'https://feriurnik.herokuapp.com/urniki?id=[' + newSelectedIdSmer + ']';
        }
        return urnikLink;
    }

    _getAsyncUrnik = (urnikPropCheckSelected) => {
        getIzbira()
            .then((result) => {
                if (result != null) {
                    const dateZaSinhronizacijo = result.datum;
                    const trenutniDate = new Date();

                    if (trenutniDate >= dateZaSinhronizacijo) {
                        let povezava = this.state.isConnected;
                        if (povezava === true) {
                            this._getFetchUrnik(urnikPropCheckSelected);
                        } else {
                            this._setUrnikData(result.urnik);
                        }
                    } else if (trenutniDate <= dateZaSinhronizacijo) {
                        this._setUrnikData(result.urnik);
                    }
                }
            })
    }

    _setAsyncUrnik = (newPolje) => {
        getIzbira()
            .then((result) => {
                if (result != null) {
                    const date = new Date()
                    date.setDate(date.getDate() + 1);

                    insertUrnik(newPolje);

                    this._setUrnikData(newPolje);
                }
            })
    }

    _getFetchUrnik = (urnikLink) => {
        fetch(urnikLink)
            .then(response => response.json()).then(data => {
                const newPolje = data.map(z => {
                    return {
                        ucnaenota_id: z.ucnaenota_id,
                        ime: z.ime,
                        predavatelj_ime_priimek: z.predavatelj_ime + ' ' + z.predavatelj_priimek,
                        tip: z.tip,
                        prostor: z.prostor,
                        dan: z.dan,
                        zacetek: z.zacetek,
                        trajanje: z.trajanje,
                        zacetni_teden: z.zacetni_teden,
                        koncni_teden: z.koncni_teden,
                        skupina_id: z.skupina_id
                    }
                })

                let selected = this.state.selectedWithoutSaving;

                if (selected === true) {
                    this._setUrnikData(newPolje);
                } else {
                    this._setAsyncUrnik(newPolje);
                }

            }).catch(error => {
                console.log(error);
            })
    }

    _setUrnikData = (newPolje) => {
        this.setState({ arrayUrnik: newPolje }, () => {
            let date = new Date();
            let dateNumber = date.getDay();

            if (dateNumber === 6) {
                date.setDate(date.getDate() + 2);
            } else if (dateNumber === 0) {
                date.setDate(date.getDate() + 1);
            }

            dateNumber = date.getDay();
            this._setDateStringForWeek(date);
            this._setUrnikArraysForDays(date, dateNumber);
        });
    }

    _updateUrnik = (buttonClick) => {

        let date = new Date(this.state.dateTime);
        let dateNumber = date.getDay()

        if (buttonClick === 'nextDay') {
            date = this._setDateForNextDay(date, dateNumber)
        } else if (buttonClick === 'backDay') {
            date = this._setDateForPreviousDay(date, dateNumber);
        } else if (buttonClick === 'nextWeek') {
            date = this._setDateForNextWeek(date, dateNumber);
        } else if (buttonClick = 'backWeek') {
            date = this._setDateForLastWeek(date, dateNumber);
        }
        dateNumber = date.getDay();
        this._setDateStringForWeek(date);
        this._setUrnikArraysForDays(date, dateNumber);
    }

    _setUrnikArraysForDays = (date, dateNumber) => {
        let ponArray = [], torArray = [], sreArray = [], cetArray = [], petArray = [];
        let danArray = [];

        const urnik = [...this.state.arrayUrnik];

        for (const u of urnik) {

            let zacetniTeden = new Date(u.zacetni_teden);
            let koncniTeden = new Date(u.koncni_teden);


            if (zacetniTeden <= date && koncniTeden >= date) {
                if (u.dan === dateNumber) {
                    danArray.push(u);
                }

                if (u.dan === 1) {
                    ponArray.push(u);

                } else if (u.dan === 2) {
                    torArray.push(u);
                }
                else if (u.dan === 3) {
                    sreArray.push(u);
                }
                else if (u.dan === 4) {
                    cetArray.push(u);
                }
                else if (u.dan === 5) {
                    petArray.push(u);
                }

            }
        }

        this.setState({ dateTime: date })
        this.setState({ arrayMo: ponArray });
        this.setState({ arrayTu: torArray });
        this.setState({ arrayWe: sreArray });
        this.setState({ arrayTh: cetArray });
        this.setState({ arrayFr: petArray });
        this.setState({ arraySortiranForPortraitDay: danArray });
    }

    _setDateStringForWeek = (date) => {

        let dateNextWeekFri = new Date(date)
        dateNextWeekFri.setDate(dateNextWeekFri.getDate() + 4);
        let dateForWeek = date.toDateString() + '- ' + dateNextWeekFri.toDateString();
        this.setState({ dateWeek: dateForWeek });
    }

    _setDateForNextDay = (date, dateNumber) => {
        if (dateNumber === 1 || dateNumber === 2 || dateNumber === 3 || dateNumber === 4) {
            date.setDate(date.getDate() + 1);
        } else if (dateNumber === 5) {
            date.setDate(date.getDate() + 3);
        } else if (dateNumber === 6) {
            date.setDate(date.getDate() + 2);
        } else if (dateNumber === 0) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    }

    _setDateForPreviousDay = (date, dateNumber) => {
        if (dateNumber === 2 || dateNumber === 3 || dateNumber === 4 || dateNumber === 5) {
            date.setDate(date.getDate() - 1);
        } else if (dateNumber === 1) {
            date.setDate(date.getDate() - 3);
        } else if (dateNumber === 6) {
            date.setDate(date.getDate() - 1);
        } else if (dateNumber === 0) {
            date.setDate(date.getDate() - 2);
        }
        return date;
    }

    _setDateForNextWeek = (date, dateNumber) => {
        if (dateNumber === 1) {
            date.setDate(date.getDate() + 7);
        } else if (dateNumber === 2) {
            date.setDate(date.getDate() + 6);
        } else if (dateNumber === 3) {
            date.setDate(date.getDate() + 5);
        } else if (dateNumber === 4) {
            date.setDate(date.getDate() + 4);
        } else if (dateNumber === 5) {
            date.setDate(date.getDate() + 3);
        } else if (dateNumber === 6) {
            date.setDate(date.getDate() + 2);
        } else if (dateNumber === 0) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    }

    _setDateForLastWeek = (date, dateNumber) => {

        if (dateNumber === 1) {
            date.setDate(date.getDate() - 7);
        } else if (dateNumber === 2) {
            date.setDate(date.getDate() - 6);
        } else if (dateNumber === 3) {
            date.setDate(date.getDate() - 5);
        } else if (dateNumber === 4) {
            date.setDate(date.getDate() - 4);
        } else if (dateNumber === 5) {
            date.setDate(date.getDate() - 3);
        } else if (dateNumber === 6) {
            date.setDate(date.getDate() - 2);
        } else if (dateNumber === 0) {
            date.setDate(date.getDate() - 1);
        }
        return date;
    }

    render() {

        return (
            <View style={styles.container} onLayout={this._onLayoutChange} >
                {this.state.dimensionMode === 'Portrait' ?
                    //Urnik za Portrait
                    <View style={styles.container}>
                        <ScrollView>
                            <UrnikCard
                                dan={this.state.arraySortiranForPortraitDay}
                            />
                        </ScrollView>
                        <View style={styles.footer}>
                            <Icon
                                containerStyle={{ width: '20%' }}
                                name='arrow-left'
                                type='simple-line-icon'
                                color='white'
                                size={25}
                                onPress={() => this._updateUrnik('backDay')}
                            />
                            <Text style={styles.footerText}>
                                {this.state.dateTime.toDateString()}
                            </Text>
                            <Icon
                                containerStyle={{ width: '20%' }}
                                name='arrow-right'
                                type='simple-line-icon'
                                color='white'
                                size={25}
                                onPress={() => this._updateUrnik('nextDay')}
                            />
                        </View>
                    </View> :
                    <View style={styles.container}>
                        <View style={styles.week}>
                            <Text style={styles.dayFont}>{t('Schedule.monday')}</Text>
                            <Text style={styles.dayFont}>{t('Schedule.tuesday')}</Text>
                            <Text style={styles.dayFont}>{t('Schedule.wednesday')}</Text>
                            <Text style={styles.dayFont}>{t('Schedule.thursday')}</Text>
                            <Text style={styles.dayFont}>{t('Schedule.friday')}</Text>
                        </View>
                        <ScrollView>
                            <View style={styles.week}>
                                <View style={styles.day}>
                                    <View>
                                        <UrnikCard
                                            dan={this.state.arrayMo}
                                        />
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View>
                                        <UrnikCard
                                            dan={this.state.arrayTu}
                                        />
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View>
                                        <UrnikCard
                                            dan={this.state.arrayWe}
                                        />
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View>
                                        <UrnikCard
                                            dan={this.state.arrayTh}
                                        />
                                    </View>
                                </View>
                                <View style={styles.day}>
                                    <View>
                                        <UrnikCard
                                            dan={this.state.arrayFr}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.footerLandscape}>
                            <Icon
                                containerStyle={{ width: '10%' }}
                                name='arrow-left'
                                type='simple-line-icon'
                                color='white'
                                size={20}
                                onPress={() => this._updateUrnik('backWeek')}
                            />
                            <Text style={styles.footerTextLandscape}>
                                {this.state.dateWeek}
                            </Text>
                            <Icon
                                containerStyle={{ width: '10%' }}
                                name='arrow-right'
                                type='simple-line-icon'
                                color='white'
                                size={20}
                                onPress={() => this._updateUrnik('nextWeek')}
                            />
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    week: {
        flexDirection: 'row',
    },
    day: {
        width: '20%',

    },
    dayFont: {
        width: '20%',
        backgroundColor: '#e3dedb',
        height: 25,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: '#FFC609',
        height: 35
    },
    footerLandscape: {
        flexDirection: 'row',
        backgroundColor: '#FFC609',
        height: 25
    },
    footerText: {
        width: '60%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: 'white'
    },
    footerTextLandscape: {
        width: '80%',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: 'white'
    }
});

export default Schedule;


