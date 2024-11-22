// import React, { useCallback, useEffect, useState } from "react";
// import { View, Button, Text } from "react-native";
// import Toast from "react-native-toast-message"; 

// import { useMediaQuery } from "../hooks/use-media-query";
// import { SkeletonWrapper } from "./skeleton-wrapper";

// import { UpdateUserCurrency } from "../actions/settings.action";
// import { currencies } from "../lib/currencies";

// export function CurrencyComboBox() {

//   const [open, setOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [settings, setSettings] = useState({ isFetching: true, data: null });

//   // const isDesktop = useMediaQuery("(min-width: 768px)");
  
//   async function fetchUserSettings() {

//     // const user = await getCurrentUser();

//     // if (!user) {
//     //   // Redirecting is not applicable in React Native. You might want to show a login screen instead.
//     //   throw new Error("User not authenticated. Redirect to login.");
//     // }

//     // Check for existing settings in Firestore
//     let settings = await getSettingsByUserId(user.id);

//     // If settings do not exist, create new settings with default currency "USD"
//     if (!settings) {
//       await storeSettings({userId: user.id, currency: "USD"});
//       settings = await getSettingsByUserId(user.id); // Retrieve the newly created settings
//     }

//     return settings;
//   }

//   useEffect(() => {
//     const getSettings = async () => {
//       const data = await fetchUserSettings();
//       setSettings({ isFetching: false, data });
      
//       const currency = currencies.find((currency) => currency.value === data.currency);
//       if (currency) setSelectedOption(currency);
//     };

//     getSettings();
//   }, []);

//   const onSelectOption = useCallback((currency) => {
//     if (!currency) {
//       Toast.show({ text1: "Please select currency!", type: "error" });
//       return;
//     }

//     Toast.show({ text1: "Updating Currency...", type: "info" });

//     // Assuming UpdateUserCurrency is a function that updates the currency
//     UpdateUserCurrency(currency.value)
//       .then(() => {
//         Toast.show({ text1: "Currency updated successfully!", type: "success" });
//         setSelectedOption(currencies.find((c) => c.value === currency.value) || null);
//       })
//       .catch(() => {
//         Toast.show({ text1: "Something went wrong!", type: "error" });
//       });
//   }, []);

//   if (settings.isFetching) {
//     return <SkeletonWrapper isLoading={true} />;
//   }

//   return (
//     <View style={{ padding: 16 }}>
//       <Button
//         title={selectedOption ? selectedOption.label : "Set Currency"}
//         onPress={() => setOpen(!open)} // Toggle dropdown
//       />
//       {open && (
//         <OptionList setOpen={setOpen} setSelectedOption={onSelectOption} />
//       )}
//       <Toast ref={(ref) => Toast.setRef(ref)} />
//     </View>
//   );
// }

// function OptionList({ setOpen, setSelectedOption }) {
//   return (
//     <View style={{ marginTop: 16 }}>
//       <Text>Filter currency...</Text>
//       {currencies.map((currency) => (
//         <Button
//           key={currency.value}
//           title={currency.label}
//           onPress={() => {
//             setSelectedOption(currency);
//             setOpen(false);
//           }}
//         />
//       ))}
//     </View>
//   );
// }














import React, { useCallback, useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import Toast from "react-native-toast-message"; 

// Sample mock data for currencies
const mockCurrencies = [

	{ value: "AED", label: "د.إ UAE Dirham", locale: "ar-AE" },
	{ value: "ARS", label: "$ Argentine Peso", locale: "es-AR" },
	{ value: "AUD", label: "$ Australian Dollar", locale: "en-AU" },
	{ value: "BDT", label: "৳ Bangladeshi Taka", locale: "bn-BD" },
	{ value: "BRL", label: "R$ Brazilian Real", locale: "pt-BR" },
	{ value: "CAD", label: "$ Canadian Dollar", locale: "en-CA" },
	{ value: "CHF", label: "CHF Swiss Franc", locale: "de-CH" },
	{ value: "CLP", label: "$ Chilean Peso", locale: "es-CL" },
	{ value: "CNY", label: "¥ Chinese Yuan", locale: "zh-CN" },
	{ value: "ILS", label: "₪ Israeli New Shekel", locale: "he-IL" },
	{ value: "INR", label: "₹ Indian Rupee", locale: "hi-IN" },
	{ value: "JPY", label: "¥ Yen", locale: "ja-JP" },
	{ value: "KRW", label: "₩ South Korean Won", locale: "ko-KR" },
	{ value: "KWD", label: "د.ك Kuwaiti Dinar", locale: "ar-KW" },
	{ value: "MAD", label: "MAD Moroccan Dirham", locale: "ar-MA" },
	{ value: "MXN", label: "$ Mexican Peso", locale: "es-MX" },
	{ value: "MYR", label: "RM Malaysian Ringgit", locale: "ms-MY" },
	{ value: "NGN", label: "₦ Nigerian Naira", locale: "en-NG" },
	{ value: "NOK", label: "kr Norwegian Krone", locale: "nb-NO" },
	{ value: "NZD", label: "$ New Zealand Dollar", locale: "en-NZ" },
	{ value: "OMR", label: "﷼ Omani Rial", locale: "ar-OM" },
	{ value: "PEN", label: "S/. Peruvian Sol", locale: "es-PE" },
	{ value: "PHP", label: "₱ Philippine Peso", locale: "en-PH" },
	{ value: "PKR", label: "₨ Pakistani Rupee", locale: "ur-PK" },
	{ value: "PLN", label: "zł Polish Zloty", locale: "pl-PL" },
	{ value: "QAR", label: "﷼ Qatari Riyal", locale: "ar-QA" },
	{ value: "RON", label: "lei Romanian Leu", locale: "ro-RO" },
	{ value: "RUB", label: "₽ Russian Ruble", locale: "ru-RU" },
	{ value: "SAR", label: "﷼ Saudi Riyal", locale: "ar-SA" },
	{ value: "SEK", label: "kr Swedish Krona", locale: "sv-SE" },
	{ value: "SGD", label: "$ Singapore Dollar", locale: "en-SG" },
	{ value: "THB", label: "฿ Thai Baht", locale: "th-TH" },
	{ value: "TRY", label: "₺ Turkish Lira", locale: "tr-TR" },
	{ value: "TWD", label: "NT$ New Taiwan Dollar", locale: "zh-TW" },
	{ value: "USD", label: "$ Dollar", locale: "en-US" },
	{ value: "VND", label: "₫ Vietnamese Dong", locale: "vi-VN" },
	{ value: "ZAR", label: "R South African Rand", locale: "en-ZA" }
];

// Simulate fetching user settings
const fetchUserSettings = async () => {
  // Simulating a network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ currency: "usd" }); // Default currency for testing
    }, 1000);
  });
};

// Mock UpdateUserCurrency function
const UpdateUserCurrency = async (currencyValue) => {
  // Simulating a successful currency update
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ currency: currencyValue });
    }, 500);
  });
};

// export function CurrencyComboBox() {
//   const [open, setOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [settings, setSettings] = useState({ isFetching: true, data: null });

//   useEffect(() => {
//     const getSettings = async () => {
//       const data = await fetchUserSettings();
//       setSettings({ isFetching: false, data });

//       const currency = mockCurrencies.find((currency) => currency.value === data.currency);
//       if (currency) setSelectedOption(currency);
//     };

//     getSettings();
//   }, []);

//   const onSelectOption = useCallback((currency) => {
//     if (!currency) {
//       Toast.show({ text1: "Please select currency!", type: "error" });
//       return;
//     }

//     Toast.show({ text1: "Updating Currency...", type: "info" });

//     UpdateUserCurrency(currency.value)
//       .then(() => {
//         Toast.show({ text1: "Currency updated successfully!", type: "success" });
//         setSelectedOption(mockCurrencies.find((c) => c.value === currency.value) || null);
//       })
//       .catch(() => {
//         Toast.show({ text1: "Something went wrong!", type: "error" });
//       });
//   }, []);

//   if (settings.isFetching) {
//     return <Text>Loading...</Text>; // Simplified loading state for testing
//   }

//   return (
//     <View style={{ padding: 16 }}>
//       <Button
//         title={selectedOption ? selectedOption.label : "Set Currency"}
//         onPress={() => setOpen(!open)} // Toggle dropdown
//       />
//       {open && (
//         <OptionList setOpen={setOpen} setSelectedOption={onSelectOption} />
//       )}
//       <Toast ref={(ref) => Toast.setRef(ref)} />
//     </View>
//   );
// }

export function CurrencyComboBox() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [settings, setSettings] = useState({ isFetching: true, data: null });

  useEffect(() => {
    const getSettings = async () => {
      const data = await fetchUserSettings();
      setSettings({ isFetching: false, data });

      const currency = mockCurrencies.find((currency) => currency.value === data.currency);
      if (currency) setSelectedOption(currency);
    };

    getSettings();
  }, []);

  const onSelectOption = useCallback((currency) => {clea
    if (!currency) {
      Toast.show({ text1: "Please select currency!", type: "error" });
      return;
    }

    Toast.show({ text1: "Updating Currency...", type: "info" });

    UpdateUserCurrency(currency.value)
      .then(() => {
        Toast.show({ text1: "Currency updated successfully!", type: "success" });
        setSelectedOption(mockCurrencies.find((c) => c.value === currency.value) || null);
      })
      .catch(() => {
        Toast.show({ text1: "Something went wrong!", type: "error" });
      });
  }, []);

  if (settings.isFetching) {
    return <Text>Loading...</Text>; // Simplified loading state for testing
  }

  return (
    <View style={{ padding: 16 }}>
      <Button
        title={selectedOption ? selectedOption.label : "Set Currency"}
        onPress={() => setOpen(!open)} // Toggle dropdown
      />
      {open && (
        <OptionList setOpen={setOpen} setSelectedOption={onSelectOption} />
      )}
      <Toast />
    </View>
  );
}

function OptionList({ setOpen, setSelectedOption }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text>Filter currency...</Text>
      {mockCurrencies.map((currency) => (
        <Button
          key={currency.value}
          title={currency.label}
          onPress={() => {
            setSelectedOption(currency);
            setOpen(false);
          }}
        />
      ))}
    </View>
  );
}










// import React, { useCallback, useEffect, useState } from "react";
// import { View, Button, Text } from "react-native";
// import Toast from "react-native-toast-message"; 

// import { useMediaQuery } from "../hooks/use-media-query";
// import { SkeletonWrapper } from "./skeleton-wrapper";

// import { UpdateUserCurrency } from "../actions/settings.action";
// import { currencies } from "../lib/currencies";



// import React, { useCallback, useEffect, useState } from "react";
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import Toast from "react-native-toast-message";

// import { useMediaQuery } from "../hooks/use-media-query"; // Replace with an adaptive logic for RN if necessary
// import { auth } from '../../config/firebaseConfig';
// import { currencies } from "../lib/currencies"; // Replace with actual currency data import
// import { UpdateUserCurrency } from "../actions/settings.action"; // Replace with actual action
// import { getSettingsByUserId, storeSettings } from "../services/firebaseSettings";


// export function CurrencyComboBox() {

//   const [open, setOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);

//   const userId = auth.currentUser?.uid;

//   const settings = async () => {

//       // const user = await getCurrentUser();
    
//       // if (!user) {
//       //   redirect("/auth/sign-in");
//       // }

//       let settings = await getSettingsByUserId(userId);
    
//       if (!settings) {
//         await storeSettings({ userId: userId, currency: "USD" });

//         settings = await getSettingsByUserId(userId);

//       }
    
//       return Response.json(settings);
    
//   };

//   const queryClient = useQueryClient();

//   const mutation = useMutation(UpdateUserCurrency, {
//     onSuccess: async (data) => {
//       Toast.show({ type: "success", text1: "Currency updated successfully!" });

//       await queryClient.invalidateQueries("overview");

//       setSelectedOption(currencies.find((c) => c.value === data.currency) || null);
//     },
//     onError: () => {
//       Toast.show({ type: "error", text1: "Something went wrong!" });
//     },
//   });

//   useEffect(() => {
//     if (settings.data) {
//       const currency = currencies.find((c) => c.value === settings.data.currency);
//       if (currency) setSelectedOption(currency);
//     }
//   }, [settings.data]);

//   const onSelectOption = useCallback(
//     (currency) => {
//       if (!currency) {
//         Toast.show({ type: "error", text1: "Please select a currency!" });
//         return;
//       }

//       Toast.show({ type: "info", text1: "Updating Currency..." });
//       mutation.mutate(currency.value);
//     },
//     [mutation]
//   );

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.option}
//       onPress={() => {
//         onSelectOption(item);
//         setOpen(false);
//       }}
//     >
//       <Text style={styles.optionText}>{item.label}</Text>
//     </TouchableOpacity>
//   );

//   if (settings.isFetching) {
//     return <ActivityIndicator style={styles.loader} />;
//   }

//   return (
//     <View>
//       <TouchableOpacity
//         style={[styles.button, mutation.isPending && styles.disabledButton]}
//         onPress={() => setOpen(!open)}
//         disabled={mutation.isPending}
//       >
//         <Text style={styles.buttonText}>
//           {selectedOption ? selectedOption.label : "Set Currency"}
//         </Text>
//       </TouchableOpacity>

//       {open && (
//         <View style={styles.dropdown}>
//           <TextInput style={styles.input} placeholder="Filter currency..." />
//           <FlatList
//             data={currencies}
//             keyExtractor={(item) => item.value}
//             renderItem={renderItem}
//           />
//         </View>
//       )}
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   button: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
//   buttonText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   dropdown: {
//     marginTop: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     backgroundColor: "#fff",
//   },
//   input: {
//     padding: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   option: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   loader: {
//     marginTop: 20,
//   },
// });
