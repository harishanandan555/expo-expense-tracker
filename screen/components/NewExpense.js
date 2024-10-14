import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

class NewExpenseScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionDate: new Date(),
            isDatePickerVisible: false,
            description: '',
            amount: '',
        };
    }

    handleDateConfirm = (date) => {
        this.setState({ transactionDate: date, isDatePickerVisible: false });
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Add New Expense</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Transaction Description"
                    onChangeText={(description) => this.setState({ description })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    onChangeText={(amount) => this.setState({ amount })}
                />
                <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => this.setState({ isDatePickerVisible: true })}
                >
                    <Text>{this.state.transactionDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={this.state.isDatePickerVisible}
                    mode="date"
                    onConfirm={this.handleDateConfirm}
                    onCancel={() => this.setState({ isDatePickerVisible: false })}
                />
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    datePickerButton: {
        padding: 10,
        backgroundColor: '#ddd',
        marginBottom: 20,
        borderRadius: 5,
    },
    saveButton: {
        padding: 15,
        backgroundColor: '#FF6A00',
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default NewExpenseScreen;
