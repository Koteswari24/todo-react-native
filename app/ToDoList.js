import React, { Component } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    ScrollView, FlatList, Button,
    Image,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ToDoListImage from './Images/ToDoListImage';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import fonts from './config/fonts';


const { height, width } = Dimensions.get('screen');

export default class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNotes: [],
            addItem: '',
        };
    }

    componentDidMount() {
        Tasks.all(showNotes => this.setState({ showNotes: showNotes || [] }));
    }

    handleInputChange = text => {
        this.setState({ addItem: text });
    };

    addItems = () => {
        let checkNotEmpty = this.state.addItem.trim().length > 0;
        if (checkNotEmpty) {
            this.setState(
                prevState => {
                    let { showNotes, addItem } = prevState;
                    return {
                        showNotes: showNotes.concat({ key: showNotes.length, addItem: addItem }),
                        addItem: '',
                    };
                },
                () => Tasks.save(this.state.showNotes)
            );
        }
    };

    deleteItem = (i) => {
        this.setState(
            prevState => {
                let showNotes = prevState.showNotes.slice();
                showNotes.splice(i, 1);
                return { showNotes: showNotes };
            },
            () => Tasks.save(this.state.showNotes)
        );
    };

    render() {
        return (
            <SafeAreaView style={styles.screenStyle}>
                <StatusBar backgroundColor={'#7dced4'} barStyle="light-content" />

                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.5 }}
                    colors={['#7dced4', '#aae2e6']}
                    style={styles.flexOne}
                >
                    <View style={styles.flexOne}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                Hello User,{'\n'} Here is your To do List
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputStyle}
                                underlineColorAndroid="transparent"
                                placeholder="Type here to create notes"
                                placeholderTextColor="#7a767a"
                                autoCorrect={false}
                                spellCheck={false}
                                value={this.state.addItem}
                                onChangeText={this.handleInputChange}
                                returnKeyType={'done'}
                            />
                            <TouchableOpacity
                                onPress={() => this.addItems()}
                                style={styles.imageAlign}>
                                <Image
                                    source={ToDoListImage.plus}
                                    style={styles.plusIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.container}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.showNotes}
                                contentContainerStyle={styles.listContainer}
                                renderItem={({ item, index }) => (
                                    <View style={styles.insideContainer}>
                                        <View style={styles.notesContainer}>
                                            <View style={styles.flexStyle}>
                                                <View style={styles.bulletStyles} />
                                                <Text style={styles.addItemStyles}>{item.addItem}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => this.deleteItem(index)}
                                                style={styles.imageAlign}>
                                                <Image
                                                    source={ToDoListImage.deleteIcon}
                                                    style={styles.deleteIcon}
                                                />
                                            </TouchableOpacity>

                                        </View>
                                        {
                                            this.state.showNotes.length !== index + 1 &&
                                            <View style={styles.lineStyle} />
                                        }
                                    </View>

                                )}
                                ListFooterComponent={<View style={{ height: 120 }} />}
                            />
                        </View>

                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
}

let Tasks = {
    convertToArrayOfObject(ShowNotes, callback) {

        return callback(
            ShowNotes ? ShowNotes.split('||').map((item, i) => ({ key: i, addItem: item })) : []
        );
    },
    convertToStringWithSeparators(ShowNotes) {
        return ShowNotes.map(item => item.addItem).join('||');
    },
    all(callback) {
        return AsyncStorage.getItem('SHOWNOTES', (_err, ShowNotes) =>
            this.convertToArrayOfObject(ShowNotes, callback)
        );
    },
    save(ShowNotes) {
        AsyncStorage.setItem('SHOWNOTES', this.convertToStringWithSeparators(ShowNotes));
    },
};

const styles = StyleSheet.create({
    screenStyle: {
        height: height,
        width: width
    },
    flexOne: {
        flex: 1
    },
    title: {
        color:'#4d4b4b',
        fontFamily:fonts.SEMIBOLD,
        fontSize: 30,
        textAlign: 'center',
        letterSpacing: 0.4,
    },
    titleContainer: {
        alignSelf: 'center',
        marginVertical: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 15,
    },
    inputStyle: {
        margin: 10,
        height: 50,
        borderColor: '#63a3ff',
        borderWidth: 1,
        width: width * 0.75,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#edece4'
    },
    imageAlign: {
        alignSelf: 'center',
    },
    plusIcon: {
        resizeMode: 'contain',
        height: 40,
        width: 40,
    },
    deleteIcon: {
        resizeMode: 'contain',
        height: 20,
        width: 20,
        padding:5
    },
    addItemStyles: {
        color:'#262525',
        fontFamily:fonts.MEDIUM,
        fontSize: 20,
        textAlign: 'left',
    },
    container: {
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#edece4',
        paddingTop: 10
    },
    listContainer: {
        paddingHorizontal: 30,
    },
    notesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    lineStyle: {
        marginTop: 10,
        borderColor: '#c18ff2',
        borderWidth: 0.3,
    },
    insideContainer: {
        marginTop: 20,
    },
    bulletStyles: {
        height: 7,
        width: 7,
        borderRadius: 3.5,
        backgroundColor: '#a89f9e',
        alignSelf: 'center',
        marginRight: 20
    },
    flexStyle: {
        flex: 0.9,
        flexDirection: 'row'
    }
});
