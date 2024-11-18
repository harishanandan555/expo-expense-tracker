import { useState } from 'react';
import { Alert, Linking } from 'react-native';

// Set your app's URL
let APP_URL = "http://localhost:3000";

const plan = {
  features: [
    {
      id: 1,
      label: "Unlimited Transactions",
    },
    {
      id: 2,
      label: "Unlimited Categories",
    },
  ],
  price: 5.99,
  interval: "monthly",
};

// This function will call your backend to create a Stripe customer
export async function createCustomer() {
  try {
    const response = await fetch('http://localhost:3001/stripe/create-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'user@example.com',  // Pass the user's email here (or other user-specific data)
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.customer; // Assuming customer contains the Stripe customer ID and other details
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error('Could not create customer');
  }
}

// This function will check if the user has an active subscription
export async function hasSubscription() {

  const customer = await createCustomer();

  try {
    const response = await fetch('http://localhost:3001/stripe/check-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stripeCustomerId: customer.stripeCustomerId,
      }),
    });

    const data = await response.json();
    return data.hasSubscription; // Return true or false based on subscription status
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

// Checkout function
export async function Checkout() {

  const customer = await createCustomer();

  try {
    const response = await fetch('http://localhost:3001/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stripeCustomerId: customer.stripeCustomerId,
        priceId: 'test_priceId', // Use the actual price ID here
      }),
    });

    const data = await response.json();

    if (data.checkoutUrl) {
      // Redirect the user to the checkout URL
      Linking.openURL(data.checkoutUrl);
    } else {
      Alert.alert('Error', 'Could not create checkout session.');
    }
  } catch (error) {
    console.error('Error during checkout:', error);
    Alert.alert('Error', 'There was an error during checkout.');
  }
}

// Customer portal function
export async function GenerateCustomerPortal() {
    
  const customer = await createCustomer();

  try {
    const response = await fetch('http://localhost:3001/stripe/generate-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stripeCustomerId: customer.stripeCustomerId,
      }),
    });

    const data = await response.json();

    if (data.portalUrl) {
      // Redirect the user to the customer portal
      Linking.openURL(data.portalUrl);
    } else {
      Alert.alert('Error', 'Could not generate customer portal.');
    }
  } catch (error) {
    console.error('Error generating customer portal:', error);
    Alert.alert('Error', 'There was an error generating the customer portal.');
  }
}
