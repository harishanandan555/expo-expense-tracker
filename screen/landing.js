import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation

const FEATURES = [
  { id: 1, feature: "Manage Transactions", description: "Log and organize income and expenses." },
  { id: 2, feature: "Manage Categories", description: "Create and organize transaction categories." },
  { id: 3, feature: "History with Bar Chart", description: "View yearly and monthly trends." },
  { id: 4, feature: "Advanced Filters & CSV Export", description: "Filter transactions and export data." }
];

const FAQS = [
  { id: "faq-1", question: "How do I add a new transaction?", answer: "Go to the transactions tab and click on the + icon." },
  { id: "faq-2", question: "Can I export my transaction history?", answer: "Yes, you can export it as a CSV file." },
  { id: "faq-3", question: "How do I change my billing information?", answer: "Navigate to the settings page." }
];

const plan = {
  price: "5.99",
  interval: "monthly",
  features: [
    { id: 1, label: "Unlimited Transactions" },
    { id: 2, label: "Unlimited Categories" }
  ]
};

export default function Landing() {
  const navigation = useNavigation();
  const [faqOpen, setFaqOpen] = useState({});

  const toggleFAQ = (id) => {
    setFaqOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>MoneyMap</Text>
        <Text style={styles.subtitle}>
          Empowering Your Financial Journey: Seamlessly Track, Plan, and Optimize Every Dollar with Confidence and Clarity.
        </Text>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('signin')} // Navigate to Dashboard
        >
          <Text style={styles.buttonText}>Get Started!</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureContainer}>
          {FEATURES.map((item) => (
            <FeatureCard key={item.id} title={item.feature} description={item.description} />
          ))}
        </View>
      </View>

      {/* Upgrade to Premium Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upgrade To Premium</Text>
        <View style={styles.premiumContainer}>
          <Text style={styles.premiumFeatureTitle}>Features</Text>
          {plan.features.map((feature) => (
            <FeatureField key={feature.id} label={feature.label} />
          ))}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${plan.price}</Text>
            <Text style={styles.priceInterval}>/{plan.interval}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.buttonText}>Process to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FAQs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        {FAQS.map((faq) => (
          <TouchableOpacity key={faq.id} style={styles.faqItem} onPress={() => toggleFAQ(faq.id)}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            {faqOpen[faq.id] && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

// Feature Card Component
const FeatureCard = ({ title, description }) => (
  <View style={styles.featureCard}>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

// Feature Field Component for Premium Section
const FeatureField = ({ label }) => (
  <View style={styles.featureField}>
    <Text style={styles.featureLabel}>✓ {label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    padding: 20,
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff6f00",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  getStartedButton: {
    backgroundColor: "#ff6f00",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6f00",
    marginBottom: 20,
  },
  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    color: "#fff",
  },
  featureCard: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "48%",
  },
  featureTitle: {
    fontSize: 18,
    color: "#fff", // Explicit text color
  },
  featureDescription: {
    color: "#aaa", // Explicit text color for description
    marginTop: 5,
  },
  premiumContainer: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  premiumFeatureTitle: {
    fontSize: 20,
    color: "#fff", // Explicit text color
    marginBottom: 20,
  },
  featureField: {
    marginVertical: 5,
  },
  featureLabel: {
    color: "#fff", // Explicit text color for premium features
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 20,
  },
  price: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ff6f00",
  },
  priceInterval: {
    fontSize: 20,
    color: "#aaa",
    marginLeft: 5,
  },
  checkoutButton: {
    backgroundColor: "#ff6f00",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  faqItem: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 16,
    color: "#fff",
  },
  faqAnswer: {
    marginTop: 10,
    color: "#aaa",
  },
});
