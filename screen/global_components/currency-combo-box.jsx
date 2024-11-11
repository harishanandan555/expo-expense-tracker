// import React, { useCallback, useEffect, useState } from "react";
// import { View, Button, Text } from "react-native";
// import Toast from "react-native-toast-message"; 

// import { useMediaQuery } from "../hooks/use-media-query";
// import { SkeletonWrapper } from "./skeleton-wrapper";
// import { UpdateUserCurrency } from "../actions/settings.action";
// import { currencies } from "../lib/currencies";
// import { fetchUserSettings } from "../methods/settings";

// export function CurrencyComboBox() {
//   const [open, setOpen] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [settings, setSettings] = useState({ isFetching: true, data: null });

//   const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const onSelectOption = useCallback((currency) => {
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
