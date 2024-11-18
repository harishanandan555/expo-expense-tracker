import React, { useCallback, useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { DeleteCategory } from "../actions/categories.action";

export const DeleteCategoryDialog = ({ children, category }) => {
	
	const queryClient = useQueryClient();
	const [isModalVisible, setModalVisible] = useState(false);

	const { mutate } = useMutation({
		mutationFn: DeleteCategory,
		onSuccess: async (data) => {
			Toast.show({
				type: "success",
				text1: `Category ${data.name} deleted successfully!`,
				position: "bottom",
			});

			await queryClient.invalidateQueries(["categories"]);
			setModalVisible(false);
		},
		onError: () => {
			Toast.show({
				type: "error",
				text1: "Something went wrong",
				position: "bottom",
			});
			setModalVisible(false);
		},
	});

	const onDelete = useCallback(() => {
		Toast.show({
			type: "info",
			text1: "Deleting category...",
			position: "bottom",
		});

		mutate({ name: category.name, type: category.type });
	}, [mutate, category.name, category.type]);

	return (
		<>
			<TouchableOpacity onPress={() => setModalVisible(true)}>
				{children}
			</TouchableOpacity>

			<Modal
				animationType="slide"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.title}>
							Delete {category.icon} {category.name} category
						</Text>
						<Text style={styles.description}>
							This action cannot be undone.
						</Text>
						<View style={styles.footer}>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.buttonText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.confirmButton}
								onPress={onDelete}
							>
								<Text style={styles.buttonText}>Confirm</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 8,
		alignItems: "center",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	description: {
		fontSize: 14,
		color: "#6b7280",
		marginBottom: 20,
		textAlign: "center",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	cancelButton: {
		padding: 10,
		backgroundColor: "#f3f4f6",
		borderRadius: 4,
		flex: 1,
		marginRight: 5,
		alignItems: "center",
	},
	confirmButton: {
		padding: 10,
		backgroundColor: "#ef4444",
		borderRadius: 4,
		flex: 1,
		marginLeft: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});
