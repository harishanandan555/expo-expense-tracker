// currencies array
export const currencies = [
    { value: "USD", label: "$ Dollar", locale: "en-US" },
    { value: "EUR", label: "€ Euro", locale: "de-DE" },
    { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
    { value: "GBP", label: "£ Pound", locale: "en-GB" },
    { value: "EGP", label: "EGP Egyption Pound", locale: "en-EG" },
  ];
  
  // Function to convert a date to UTC format
  export function DateToUTCDate(date) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    );
  }
  
  // Function to format currency using the selected currency code
  export function CurrencyFormatter(currency) {
    const locale = currencies.find((c) => c.value === currency)?.locale;
  
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    });
  }
  