import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../themeContext';

const EditTransactionModal = ({ visible, transaction, onClose, onSave }) => {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [description, setDescription] = useState(transaction.description);
  const [icon, setIcon] = useState(transaction.icon || '');
  const { theme } = useTheme();
   
  const handleSave = () => {
    const updatedTransaction = {
      ...transaction,
      amount: parseFloat(amount),
      category,
      description,
      icon,
    };
      onSave(updatedTransaction);
      onClose();
  };
 
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.modalContainer }]}>
          <Text style={[styles.modalTitle, { color: theme.transactionText }]}>Edit Transaction</Text>
          <Text style={{ color: theme.transactionText }}>Amount:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
            value={amount}
            keyboardType="numeric"
            onChangeText={setAmount}
          />
          <Text style={{ color: theme.transactionText }}>Category:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
            value={category}
            onChangeText={setCategory}
          />
          <Text style={{ color: theme.transactionText }}>Description:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
            value={description}
            onChangeText={setDescription}
          />
          <Text style={{ color: theme.transactionText }}>Icon:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.inputText }]}
            value={icon}
            onChangeText={setIcon}
          />
          <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, { backgroundColor: theme.currentTheme === 'dark' ? '#ec971f' : '#449d44' }]}
            >
              <Text style={[styles.buttonText,{color: theme.inputText}]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={handleClose}
              style={[styles.button, { backgroundColor: theme.currentTheme === 'dark' ? '#d9534f' : '#d9534f', color: theme.inputText }]}
            >
              <Text style={[styles.buttonText,{color: theme.inputText}]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingLeft:10,
    paddingRight:10
  },
  button: {
    width: 75, // Increase button width
    height:50,
    textAlign:'center',
    justifyContent:'center',
    paddingLeft:20,
    borderRadius:5,
    borderColor:'#333',
    borderWidth:1
  },
});

export default EditTransactionModal;
