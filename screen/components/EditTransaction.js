import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';

const EditTransactionModal = ({ visible, transaction, onClose, onSave }) => {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [category, setCategory] = useState(transaction.category);
  const [description, setDescription] = useState(transaction.description);
  const [icon, setIcon] = useState(transaction.icon || '');

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
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Transaction</Text>
          <Text>Amount:</Text>
          <TextInput
            style={styles.input}
            value={amount}
            keyboardType="numeric"
            onChangeText={setAmount}
          />
          <Text>Category:</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
          />
          <Text>Description:</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />
          <Text>Icon:</Text>
          <TextInput
            style={styles.input}
            value={icon}
            onChangeText={setIcon}
          />
          <Button title="Save Changes" onPress={handleSave} />
          <Button title="Cancel" onPress={onClose} />
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
    backgroundColor: 'white',
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
  },
});

export default EditTransactionModal;
