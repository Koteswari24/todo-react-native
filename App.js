/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ToDoList from './app/ToDoList';


export default class App extends Component {
  constructor(props) {
    super(props)

  }
  render() {
    return (
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'} />
        <ToDoList/>
      </SafeAreaView>
    );
  }
};

