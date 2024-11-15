import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import Toast from 'react-native-toast-message';

import { CreateCategory } from "../actions/categories.action";

export const CreateCategoryDialog = ({ type, onSuccessCallback }) => {
    const [open, setOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const { control, handleSubmit, formState: { isValid }, reset, watch } = useForm({
        defaultValues: {
            name: '',
            icon: '',
            type,
        },
    });

    const onSubmit = useCallback((values) => {
        Toast.show({
            type: 'info',
            text1: 'Creating Category...',
        });

        // Simulate API call with a timeout
        setTimeout(() => {
            Toast.show({
                type: 'success',
                text1: `Category ${values.name} created successfully!`,
            });

            onSuccessCallback(values);
            reset();
            setOpen(false); // Close dialog after success
        }, 1500);
    }, [onSuccessCallback, reset]);

    return (
        <>
            <TouchableOpacity style={styles.createButton} onPress={() => setOpen(true)}>
                <Text style={styles.createButtonText}>Create New</Text>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.dialogContent}>
                        <Text style={styles.dialogTitle}>Create {type} Category</Text>
                        <Text style={styles.dialogDescription}>Categories help group your transactions.</Text>

                        {/* Form Fields */}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.formItem}>
                                    <Text style={styles.formLabel}>Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Category"
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="icon"
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.formItem}>
                                    <Text style={styles.formLabel}>Icon</Text>
                                    <TouchableOpacity style={styles.iconSelector} onPress={() => setIsEmojiPickerOpen(true)}>
                                        <Text style={styles.icon}>{value || "Select Icon"}</Text>
                                    </TouchableOpacity>
                                    {isEmojiPickerOpen && (
                                        <EmojiSelector
                                            onEmojiSelected={(emoji) => {
                                                onChange(emoji);
                                                setIsEmojiPickerOpen(false);
                                            }}
                                            showSearchBar={true}
                                            category={Categories.Smileys}
                                            columns={8}
                                        />
                                    )}
                                </View>
                            )}
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setOpen(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, !isValid && styles.disabledButton]}
                                onPress={handleSubmit(onSubmit)}
                                disabled={!isValid}
                            >
                                {isValid ? <Text style={styles.buttonText}>Save</Text> : <ActivityIndicator color="#fff" />}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Toast />
        </>
    );
};

const styles = StyleSheet.create({
    createButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#333',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dialogDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    formItem: {
        marginBottom: 15,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    iconSelector: {
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    icon: {
        fontSize: 24,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
        alignItems: 'center',
    },
    saveButton: {
        flex: 1,
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#888',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
