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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample mock data for currencies
const mockCurrencies = [

	{ value: "AED", label: "د.إ UAE Dirham", locale: "ar-AE", symbol: "د.إ", country: "United Arab Emirates" },
	{ value: "AFN", label: "؋ Afghan Afghani", locale: "fa-AF", symbol: "؋", country: "Afghanistan" },
	{ value: "ALL", label: "L Albanian Lek", locale: "sq-AL", symbol: "L", country: "Albania" },
	{ value: "AMD", label: "֏ Armenian Dram", locale: "hy-AM", symbol: "֏", country: "Armenia" },
	{ value: "ANG", label: "ƒ Netherlands Antillean Guilder", locale: "nl-AN", symbol: "ƒ", country: "Netherlands Antilles" },
	{ value: "AOA", label: "Kz Angolan Kwanza", locale: "pt-AO", symbol: "Kz", country: "Angola" },
	{ value: "ARS", label: "$ Argentine Peso", locale: "es-AR", symbol: "$", country: "Argentina" },
	{ value: "AUD", label: "$ Australian Dollar", locale: "en-AU", symbol: "$", country: "Australia" },
	{ value: "AWG", label: "ƒ Aruban Florin", locale: "nl-AW", symbol: "ƒ", country: "Aruba" },
	{ value: "AZN", label: "₼ Azerbaijani Manat", locale: "az-AZ", symbol: "₼", country: "Azerbaijan" },
	{ value: "BAM", label: "KM Bosnia and Herzegovina Convertible Mark", locale: "bs-BA", symbol: "KM", country: "Bosnia and Herzegovina" },
	{ value: "BBD", label: "$ Barbadian Dollar", locale: "en-BB", symbol: "$", country: "Barbados" },
	{ value: "BDT", label: "৳ Bangladeshi Taka", locale: "bn-BD", symbol: "৳", country: "Bangladesh" },
	{ value: "BGN", label: "лв Bulgarian Lev", locale: "bg-BG", symbol: "лв", country: "Bulgaria" },
	{ value: "BHD", label: "ب.د Bahraini Dinar", locale: "ar-BH", symbol: "ب.د", country: "Bahrain" },
	{ value: "BIF", label: "FBu Burundian Franc", locale: "fr-BI", symbol: "FBu", country: "Burundi" },
	{ value: "BMD", label: "$ Bermudian Dollar", locale: "en-BM", symbol: "$", country: "Bermuda" },
	{ value: "BND", label: "$ Brunei Dollar", locale: "ms-BN", symbol: "$", country: "Brunei" },
	{ value: "BOB", label: "Bs Bolivian Boliviano", locale: "es-BO", symbol: "Bs", country: "Bolivia" },
	{ value: "BRL", label: "R$ Brazilian Real", locale: "pt-BR", symbol: "R$", country: "Brazil" },
	{ value: "BSD", label: "$ Bahamian Dollar", locale: "en-BS", symbol: "$", country: "Bahamas" },
	{ value: "BTN", label: "Nu. Bhutanese Ngultrum", locale: "dz-BT", symbol: "Nu.", country: "Bhutan" },
	{ value: "BWP", label: "P Botswana Pula", locale: "en-BW", symbol: "P", country: "Botswana" },
	{ value: "BYN", label: "Br Belarusian Ruble", locale: "be-BY", symbol: "Br", country: "Belarus" },
	{ value: "BZD", label: "$ Belize Dollar", locale: "en-BZ", symbol: "$", country: "Belize" },
	{ value: "CAD", label: "$ Canadian Dollar", locale: "en-CA", symbol: "$", country: "Canada" },
	{ value: "CDF", label: "FC Congolese Franc", locale: "fr-CD", symbol: "FC", country: "Democratic Republic of the Congo" },
	{ value: "CHF", label: "CHF Swiss Franc", locale: "de-CH", symbol: "CHF", country: "Switzerland" },
	{ value: "CLP", label: "$ Chilean Peso", locale: "es-CL", symbol: "$", country: "Chile" },
	{ value: "CNY", label: "¥ Chinese Yuan", locale: "zh-CN", symbol: "¥", country: "China" },
	{ value: "COP", label: "$ Colombian Peso", locale: "es-CO", symbol: "$", country: "Colombia" },
	{ value: "CRC", label: "₡ Costa Rican Colón", locale: "es-CR", symbol: "₡", country: "Costa Rica" },
	{ value: "CUP", label: "₱ Cuban Peso", locale: "es-CU", symbol: "₱", country: "Cuba" },
	{ value: "CVE", label: "$ Cape Verdean Escudo", locale: "pt-CV", symbol: "Esc", country: "Cape Verde" },
	{ value: "CZK", label: "Kč Czech Koruna", locale: "cs-CZ", symbol: "Kč", country: "Czech Republic" },
	{ value: "DJF", label: "Fdj Djiboutian Franc", locale: "fr-DJ", symbol: "Fdj", country: "Djibouti" },
	{ value: "DKK", label: "kr Danish Krone", locale: "da-DK", symbol: "kr", country: "Denmark" },
	{ value: "DOP", label: "RD$ Dominican Peso", locale: "es-DO", symbol: "RD$", country: "Dominican Republic" },
	{ value: "DZD", label: "دج Algerian Dinar", locale: "ar-DZ", symbol: "دج", country: "Algeria" },
	{ value: "EGP", label: "EGP Egyptian Pound", locale: "en-EG", symbol: "EGP", country: "Egypt" },
	{ value: "ERN", label: "Nfk Eritrean Nakfa", locale: "ti-ER", symbol: "Nfk", country: "Eritrea" },
	{ value: "ETB", label: "Br Ethiopian Birr", locale: "am-ET", symbol: "Br", country: "Ethiopia" },
	{ value: "EUR", label: "€ Euro", locale: "de-DE", symbol: "€", country: "Eurozone" },
	{ value: "FJD", label: "$ Fijian Dollar", locale: "en-FJ", symbol: "$", country: "Fiji" },
	{ value: "FKP", label: "£ Falkland Islands Pound", locale: "en-FK", symbol: "£", country: "Falkland Islands" },
	{ value: "GBP", label: "£ Pound Sterling", locale: "en-GB", symbol: "£", country: "United Kingdom" },
	{ value: "GEL", label: "₾ Georgian Lari", locale: "ka-GE", symbol: "₾", country: "Georgia" },
	{ value: "GHS", label: "₵ Ghanaian Cedi", locale: "en-GH", symbol: "₵", country: "Ghana" },
	{ value: "GIP", label: "£ Gibraltar Pound", locale: "en-GI", symbol: "£", country: "Gibraltar" },
  { value: "GMD", label: "D Gambian Dalasi", locale: "en-GM", symbol: "D", country: "Gambia" },
  { value: "GNF", label: "FG Guinean Franc", locale: "fr-GN", symbol: "FG", country: "Guinea" },
  { value: "GTQ", label: "Q Guatemalan Quetzal", locale: "es-GT", symbol: "Q", country: "Guatemala" },
  { value: "GYD", label: "$ Guyanese Dollar", locale: "en-GY", symbol: "$", country: "Guyana" },
  { value: "HKD", label: "$ Hong Kong Dollar", locale: "zh-HK", symbol: "$", country: "Hong Kong" },
  { value: "HNL", label: "L Honduran Lempira", locale: "es-HN", symbol: "L", country: "Honduras" },
  { value: "HRK", label: "kn Croatian Kuna", locale: "hr-HR", symbol: "kn", country: "Croatia" },
  { value: "HTG", label: "G Haitian Gourde", locale: "fr-HT", symbol: "G", country: "Haiti" },
  { value: "HUF", label: "Ft Hungarian Forint", locale: "hu-HU", symbol: "Ft", country: "Hungary" },
  { value: "IDR", label: "Rp Indonesian Rupiah", locale: "id-ID", symbol: "Rp", country: "Indonesia" },
  { value: "ILS", label: "₪ Israeli New Shekel", locale: "he-IL", symbol: "₪", country: "Israel" },
  { value: "INR", label: "₹ Indian Rupee", locale: "hi-IN", symbol: "₹", country: "India" },
  { value: "IQD", label: "ع.د Iraqi Dinar", locale: "ar-IQ", symbol: "ع.د", country: "Iraq" },
  { value: "IRR", label: "﷼ Iranian Rial", locale: "fa-IR", symbol: "﷼", country: "Iran" },
  { value: "ISK", label: "kr Icelandic Króna", locale: "is-IS", symbol: "kr", country: "Iceland" },
  { value: "JMD", label: "$ Jamaican Dollar", locale: "en-JM", symbol: "$", country: "Jamaica" },
  { value: "JOD", label: "د.ا Jordanian Dinar", locale: "ar-JO", symbol: "د.ا", country: "Jordan" },
  { value: "JPY", label: "¥ Japanese Yen", locale: "ja-JP", symbol: "¥", country: "Japan" },
  { value: "KES", label: "KSh Kenyan Shilling", locale: "en-KE", symbol: "KSh", country: "Kenya" },
  { value: "KGS", label: "лв Kyrgyzstani Som", locale: "ky-KG", symbol: "лв", country: "Kyrgyzstan" },
  { value: "KHR", label: "៛ Cambodian Riel", locale: "km-KH", symbol: "៛", country: "Cambodia" },
  { value: "KMF", label: "CF Comorian Franc", locale: "fr-KM", symbol: "CF", country: "Comoros" },
  { value: "KPW", label: "₩ North Korean Won", locale: "ko-KP", symbol: "₩", country: "North Korea" },
  { value: "KRW", label: "₩ South Korean Won", locale: "ko-KR", symbol: "₩", country: "South Korea" },
  { value: "KWD", label: "د.ك Kuwaiti Dinar", locale: "ar-KW", symbol: "د.ك", country: "Kuwait" },
  { value: "KYD", label: "$ Cayman Islands Dollar", locale: "en-KY", symbol: "$", country: "Cayman Islands" },
  { value: "KZT", label: "₸ Kazakhstani Tenge", locale: "kk-KZ", symbol: "₸", country: "Kazakhstan" },
  { value: "LAK", label: "₭ Lao Kip", locale: "lo-LA", symbol: "₭", country: "Laos" },
  { value: "LBP", label: "ل.ل Lebanese Pound", locale: "ar-LB", symbol: "ل.ل", country: "Lebanon" },
  { value: "LKR", label: "₨ Sri Lankan Rupee", locale: "si-LK", symbol: "₨", country: "Sri Lanka" },
  { value: "LRD", label: "$ Liberian Dollar", locale: "en-LR", symbol: "$", country: "Liberia" },
  { value: "LSL", label: "L Lesotho Loti", locale: "st-LS", symbol: "L", country: "Lesotho" },
  { value: "LYD", label: "ل.د Libyan Dinar", locale: "ar-LY", symbol: "ل.د", country: "Libya" },
  { value: "MAD", label: "د.م Moroccan Dirham", locale: "ar-MA", symbol: "د.م", country: "Morocco" },
  { value: "MDL", label: "L Moldovan Leu", locale: "ro-MD", symbol: "L", country: "Moldova" },
  { value: "MGA", label: "Ar Malagasy Ariary", locale: "mg-MG", symbol: "Ar", country: "Madagascar" },
  { value: "MKD", label: "ден Macedonian Denar", locale: "mk-MK", symbol: "ден", country: "North Macedonia" },
  { value: "MMK", label: "K Burmese Kyat", locale: "my-MM", symbol: "K", country: "Myanmar" },
  { value: "MNT", label: "₮ Mongolian Tögrög", locale: "mn-MN", symbol: "₮", country: "Mongolia" },
  { value: "MOP", label: "P Macanese Pataca", locale: "zh-MO", symbol: "P", country: "Macau" },
  { value: "MUR", label: "₨ Mauritian Rupee", locale: "en-MU", symbol: "₨", country: "Mauritius" },
  { value: "MVR", label: "ރ. Maldivian Rufiyaa", locale: "dv-MV", symbol: "ރ.", country: "Maldives" },
  { value: "MWK", label: "MK Malawian Kwacha", locale: "en-MW", symbol: "MK", country: "Malawi" },
  { value: "MXN", label: "$ Mexican Peso", locale: "es-MX", symbol: "$", country: "Mexico" },
  { value: "MYR", label: "RM Malaysian Ringgit", locale: "ms-MY", symbol: "RM", country: "Malaysia" },
  { value: "MZN", label: "MT Mozambican Metical", locale: "pt-MZ", symbol: "MT", country: "Mozambique" },
  { value: "NAD", label: "$ Namibian Dollar", locale: "en-NA", symbol: "$", country: "Namibia" },
  { value: "NGN", label: "₦ Nigerian Naira", locale: "en-NG", symbol: "₦", country: "Nigeria" },
  { value: "NIO", label: "C$ Nicaraguan Córdoba", locale: "es-NI", symbol: "C$", country: "Nicaragua" },
  { value: "NOK", label: "kr Norwegian Krone", locale: "nb-NO", symbol: "kr", country: "Norway" },
  { value: "NPR", label: "₨ Nepalese Rupee", locale: "ne-NP", symbol: "₨", country: "Nepal" },
  { value: "NZD", label: "$ New Zealand Dollar", locale: "en-NZ", symbol: "$", country: "New Zealand" },
  { value: "OMR", label: "ر.ع Omani Rial", locale: "ar-OM", symbol: "ر.ع", country: "Oman" },
  { value: "PAB", label: "B/. Panamanian Balboa", locale: "es-PA", symbol: "B/.", country: "Panama" },
  { value: "PEN", label: "S/ Peruvian Sol", locale: "es-PE", symbol: "S/", country: "Peru" },
  { value: "PGK", label: "K Papua New Guinean Kina", locale: "en-PG", symbol: "K", country: "Papua New Guinea" },
  { value: "PHP", label: "₱ Philippine Peso", locale: "en-PH", symbol: "₱", country: "Philippines" },
  { value: "PKR", label: "₨ Pakistani Rupee", locale: "ur-PK", symbol: "₨", country: "Pakistan" },
  { value: "PLN", label: "zł Polish Zloty", locale: "pl-PL", symbol: "zł", country: "Poland" },
  { value: "PYG", label: "₲ Paraguayan Guarani", locale: "es-PY", symbol: "₲", country: "Paraguay" },
  { value: "QAR", label: "ر.ق Qatari Riyal", locale: "ar-QA", symbol: "ر.ق", country: "Qatar" },
  { value: "RON", label: "lei Romanian Leu", locale: "ro-RO", symbol: "lei", country: "Romania" },
  { value: "RSD", label: "дин Serbian Dinar", locale: "sr-RS", symbol: "дин", country: "Serbia" },
  { value: "RUB", label: "₽ Russian Ruble", locale: "ru-RU", symbol: "₽", country: "Russia" },
  { value: "RWF", label: "FRw Rwandan Franc", locale: "rw-RW", symbol: "FRw", country: "Rwanda" },
];

// Simulate fetching user settings
const fetchUserSettings = async () => {
  // Simulating a network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ currency: "INR" }); // Default currency for testing
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


export function CurrencyComboBox({theme}) {
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

  const onSelectOption = useCallback(async (currency) => {
    if (!currency) {
      Toast.show({ text1: "Please select currency!", type: "error" });
      return;
    }

    Toast.show({ text1: "Updating Currency...", type: "info" });

    try {
      // Update the currency via API or backend
      await UpdateUserCurrency(currency.value);

      // Save the selected currency to AsyncStorage
      await AsyncStorage.setItem("selectedCurrency", JSON.stringify(currency));

      // Update the selected option state
      setSelectedOption(mockCurrencies.find((c) => c.value === currency.value) || null);

      Toast.show({ text1: "Currency updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating currency:", error);
      Toast.show({ text1: "Something went wrong!", type: "error" });
    }
  }, []);


  if (settings.isFetching) {
    return <Text>Loading...</Text>; // Simplified loading state for testing
  }

  return (
    <View style={{ padding: 10 }}>

      <Button
        title={selectedOption ? selectedOption.label : "Set Currency"}
        onPress={() => setOpen(!open)} // Toggle dropdown
        color={theme.buttonBackground}
      />

      {open && (
        <OptionList setOpen={setOpen} setSelectedOption={onSelectOption} />
      )}

      <Toast style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}/>

    </View>
  );
}

function OptionList({ setOpen, setSelectedOption }) {
  return (
    <View style={{ marginTop: 0 }}>
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
