import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, Picker, Alert, NetInfo, Keyboard } from 'react-native';
import { Card, Button, Text, FormLabel, CheckBox } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
console.disableYellowBox = true;

import { insertIzbira } from '../databases/queries';

import { t } from '../locales/i18n';

class Student extends Component {
    state = {
        arrayPredmeti: [],
        poljeLetnikovZaPredmet: [],
        arraySmeri: [],
        arraySkupine: [],
        selectedPredmet: '',
        selectedLetnik: '',
        selectedSmer: '',
        selectedSkupina: '',
        checked: false,
        selectedItems: [],
    }

    componentDidMount() {
        this._getProgramiFetch();
    }

    componentWillUnmount() { }

    _getProgramiFetch = () => {
        fetch('https://feriurnik.herokuapp.com/programi')
            .then(response => response.json()).then(data => {
                const newPolje = data.map(z => {
                    return {
                        program_id: z.program_id, ime: z.ime, leta: z.leta
                    }
                })
                this.setState({ arrayPredmeti: newPolje });
            }).catch(error => {
                console.log(error);
            })
    }

    _getSmeriFetch = (link) => {
        fetch(link)
            .then(response => response.json()).then(data => {
                const arraySmeri = data.map(z => {
                    return {
                        smer_id: z.smer_id, ime: z.ime, koda: z.koda, letnik: z.letnik, program_id: z.program_id
                    }
                })
                this.setState({ arraySmeri: arraySmeri });
            }).catch(error => {
                console.log(error);
            })
    }

    _getSkupineFetch = (link) => {
        fetch(link)
            .then(response => response.json()).then(data => {
                const arraySkupine = data.map(z => {
                    return {
                        skupina_id: z.skupina_id.toString(), ime: z.ime, class: z.class, smer_id: z.smer_id
                    }
                })

                this.setState({ arraySkupine: arraySkupine });
                this.setState({ selectedSkupina: arraySkupine[0].skupina_id });
            }).catch(error => {
                console.log(error);
            })
    }

    _getSmeri = () => {
        let predmet_id = this.state.selectedPredmet.program_id;
        let predmet_letnik = this.state.selectedLetnik;

        let linkPredmet = '';

        if (typeof (predmet_id) !== "undefined" && predmet_letnik !== 0) {
            linkPredmet = 'https://feriurnik.herokuapp.com/smeri?id=' + predmet_id + '&letnik=' + predmet_letnik;
            this._getSmeriFetch(linkPredmet);
        }
    }

    _getSkupine = () => {
        let smer_id = this.state.selectedSmer.smer_id;

        if (typeof (smer_id) !== "undefined") {
            let linkSkupine = 'https://feriurnik.herokuapp.com/skupine?id=' + smer_id;
            this._getSkupineFetch(linkSkupine);
        }
    }

    _getUrnikStudent = () => {
        let skupineId = this.state.selectedItems;

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected === true) {

                if (this.state.checked === true && skupineId.length !== 0) {
                    insertIzbira(skupineId, this.state.selectedPredmet.ime, this.state.selectedLetnik, this.state.selectedSmer.ime)
                    .then(() => {
                        const { navigation } = this.props;
                        this.props.navigation.navigate('Schedule', { selectedSkupinaSave: skupineId });
                        navigation.state.params.onSelect();           
                    })        
                } else if (this.state.checked === false && skupineId.length !== 0) {
                    this.props.navigation.navigate('Schedule', { selectedSkupina: skupineId });
                } else {
                    Alert.alert(
                        `${t('Student.alertgrouptitle')}`,
                        `${t('Student.alertgroupmsg')}`,
                        [
                            { text: `${t('Student.alertclose')}`, style: 'cancel' },
                        ],
                        { cancelable: false }
                    )
                }
            } else if (isConnected === false) {
                Alert.alert(
                    `${t('Student.alertinternettitle')}`,
                    `${t('Student.alertinternetpmsg')}`,
                    [
                        { text: `${t('Student.alertclose')}`, style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            }
        });

    }

    _createArrayOfLetnikovPredmeta = () => {
        if (this.state.selectedPredmet != 0) {
            let arrayPoljeLetnikovZaPredmet = Array.from(Array(this.state.selectedPredmet.leta), (_, x) => x + 1);
            arrayPoljeLetnikovZaPredmet.unshift(0);
            this.setState({ poljeLetnikovZaPredmet: arrayPoljeLetnikovZaPredmet });
        }
    }

    _onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
        if (selectedItems.length === 0) {
            this.setState({ checked: false });
        }
    };

    _toggleCheckbox = () => {
        if (this.state.selectedItems.length !== 0) {
            let checkBoxToggle = this.state.checked;
            this.setState({ checked: !checkBoxToggle });
        }
        else {
            Alert.alert(
                `${t('Student.alertgrouptitle')}`,
                `${t('Student.alertgroupmsg')}`,
                [
                    { text: `${t('Student.alertclose')}`, style: 'cancel' },
                ],
                { cancelable: false }
            )
        }

    }

    clearSelectedCategories = () => {
        this.setState({ selectedItems: [] });
        this.setState({ arraySmeri: [] });
        this.setState({ arraySkupine: [] });
        this.setState({ checked: false });
    };

    render() {

        const pickerItemsProgrami = this.state.arrayPredmeti.map((p, i) => {
            return <Picker.Item key={i} value={p} label={p.ime} />
        });

        const pickerItemsLetniki = this.state.poljeLetnikovZaPredmet.map((p, i) => {
            if (p === 0) {
                return <Picker.Item key={i} value={p} label={t('Student.chooseyear')} />
            } else {
                let letnik = p.toString();
                return <Picker.Item key={i} value={p} label={letnik} />
            }
        });

        let pickerItemsSmeri = null;
        if ((this.state.arraySmeri).length !== 0) {
            pickerItemsSmeri = this.state.arraySmeri.map((p, i) => {
                return <Picker.Item key={i} value={p} label={p.ime} />
            });
        } else {
            pickerItemsSmeri = (<Picker.Item value='0' label='' />);
        }

        const pickerItemsSkupine = this.state.arraySkupine.map((p, i) => {
            return <Picker.Item key={i} value={p.skupina_id} label={p.ime} />
        });

        return (

            <View style={styles.container} >
                <ScrollView>
                    <Card>
                        <FormLabel>{t('Student.program')}</FormLabel>
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.selectedPredmet}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedPredmet: itemValue }, () => {
                                this._createArrayOfLetnikovPredmeta();
                                this.clearSelectedCategories()

                            })} >
                            <Picker.Item label={t('Student.chooseprogram')} value='0' />
                            {pickerItemsProgrami}
                        </Picker>

                        <FormLabel>{t('Student.year')}</FormLabel>
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.selectedLetnik}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedLetnik: itemValue }, () => {
                                this._getSmeri();
                            })} >
                            {pickerItemsLetniki}
                        </Picker>

                        <FormLabel>{t('Student.course')}</FormLabel>
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.selectedSmer}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedSmer: itemValue }, () => {
                                this._getSkupine();
                            })} >
                            {pickerItemsSmeri}
                        </Picker>

                        <FormLabel>{t('Student.group')}</FormLabel>
                        <View style={styles.multiPic}>
                            <MultiSelect
                                hideTags
                                items={this.state.arraySkupine}
                                uniqueKey="skupina_id"
                                onSelectedItemsChange={this._onSelectedItemsChange}
                                selectedItems={this.state.selectedItems}
                                selectText={t('Student.grouppicker')}
                                selectedItemIconColor='#036384'
                                searchInputPlaceholderText="..."
                                altFontFamily="ProximaNova-Light"
                                tagRemoveIconColor="#CCC"
                                tagBorderColor="#CCC"
                                tagTextColor="#CCC"
                                selectedItemTextColor="red"
                                itemTextColor="#000"
                                displayKey="ime"
                                searchInputStyle={{ color: '#CCC' }}
                                hideSubmitButton
                                autoFocusInput={false}
                            />
                        </View>
                        <CheckBox
                            center
                            title={t('Student.rememberchoice')}
                            checked={this.state.checked}
                            onIconPress={this._toggleCheckbox}
                        />
                    </Card>
                    <View style={styles.button}>
                        <Button
                            title={t('Student.display')}
                            backgroundColor="#FFC609"
                            titleStyle={{ fontWeight: "bold" }}
                            onPress={this._getUrnikStudent}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Student;

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: 'column',
        flex: 1
    },
    picker: {
        height: 50,
        width: 400,
        marginLeft: 12
    },
    button: {
        marginTop: 10,
    },
    multiPic: {
        marginTop: 10,
        marginLeft: 22,
        width: '90%'
    }
});