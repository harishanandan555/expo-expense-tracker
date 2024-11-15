// import { stripe } from "../lib/stripe";
// import { getCurrentUser } from './user.services';
// import { storeStripeCustomer, getStripeCustomerByUserId } from './firebaseSettings';

// exports.createCustomer = async (req, res) => {
//   const user = await getCurrentUser(req); // Ensure this extracts user data from token/session

//   if (!user) {
//     return res.status(401).json({ redirect: "/auth/sign-in" });
//   }

//   let stripeCustomer = await getStripeCustomerByUserId(user.id);

//   if (!stripeCustomer) {
//     const customer = await stripe.customers.create({
//       email: String(user.email),
//     });

//     stripeCustomer = await storeStripeCustomer({
//       userId: user.id,
//       stripeCustomerId: customer.id,
//     });
//   }

//   res.json(stripeCustomer);
// };

// exports.hasSubscription = async (req, res) => {
//   const customer = await this.createCustomer(req, res);

//   const subscriptions = await stripe.subscriptions.list({
//     customer: customer.stripeCustomerId,
//   });

//   res.json({ hasSubscription: subscriptions.data.length > 0 });
// };
// // 