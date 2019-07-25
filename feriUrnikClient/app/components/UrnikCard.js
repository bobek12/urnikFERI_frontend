import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';

const UrnikCard = (props) => {

    _getUraKoncna = (zacetek, trajanje) => {

        let timeD = new Date('2013-02-08T' + zacetek); //datum je noter samo zaradi uporabe funckije Date in je dummy podatek

        let stevilo30 = (trajanje * 30);
        let stevilo30IzracunUr = (trajanje * 30) / 60
        let ure = parseInt(stevilo30IzracunUr);
        let minuteIzracun = stevilo30 - (ure * 60);

        timeD.setHours(timeD.getHours() + ure);
        timeD.setMinutes(timeD.getMinutes() + minuteIzracun);

        let konecTrajanjaH = timeD.getHours();
        let minute = timeD.getMinutes();
        let konecTrajanjaM = minute === 0 ? '00' : minute;

        let koncnaUra = konecTrajanjaH - 1 + ':' + konecTrajanjaM;
        return koncnaUra
    }

    const urnikArray = props.dan.map((m, i) => {
        let koncnaUra = this._getUraKoncna(m.zacetek, m.trajanje)
        return (
            < Card title={m.ime} key={i} >
                <Text h5>{m.zacetek + '-' + koncnaUra}  </Text>
                <Text>{m.predavatelj_ime_priimek} </Text>
                <Text>{m.tip} </Text>
                <Text>{m.prostor} </Text>
            </Card >
        );
    });
    return (urnikArray);

}
export default UrnikCard;