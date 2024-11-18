
// import { Router } from 'express';
// import Stripe from 'stripe';

// const router = Router();
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const priceId = process.env.STRIPE_PRICEID;

// // Create a Stripe customer
// router.post('/create-customer', async (req, res) => {
//     try {
//       const { email } = req.body;  // Get user email from the request
  
//       if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//       }
  
//       const customer = await stripe.customers.create({
//         email,
//       });
  
//       // Store the customer in your database (example only, customize for your app)
//       // You can use something like `user.id` if you're linking this to a user
  
//       // Returning the customer details
//       return res.status(201).json({ customer });
  
//     } catch (error) {
//       console.error('Error creating customer:', error);
//       return res.status(500).json({ error: 'Could not create customer' });
//     }
// });
  
// // Check if the customer has an active subscription
// router.post('/check-subscription', async (req, res) => {
//     try {
//         const { stripeCustomerId } = req.body;  // Get Stripe customer ID from the request

//         if (!stripeCustomerId) {
//         return res.status(400).json({ error: 'Stripe Customer ID is required' });
//         }

//         const subscriptions = await stripe.subscriptions.list({
//         customer: stripeCustomerId,
//         status: 'active',
//         });

//         const hasSubscription = subscriptions.data.length > 0;

//         return res.status(200).json({ hasSubscription });
//     } catch (error) {
//         console.error('Error checking subscription:', error);
//         return res.status(500).json({ error: 'Could not check subscription' });
//     }
// });
  
// // Create a Stripe Checkout session
// router.post('/checkout', async (req, res) => {
//     try {
//       const { stripeCustomerId, priceId } = req.body;  // Get customer and price ID
  
//       if (!stripeCustomerId || !priceId) {
//         return res.status(400).json({ error: 'Stripe Customer ID and Price ID are required' });
//       }
  
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         customer: stripeCustomerId,
//         line_items: [
//           {
//             price: priceId,
//             quantity: 1,
//           },
//         ],
//         mode: 'subscription',
//         success_url: 'http://localhost:3000/dashboard?success=true',
//         cancel_url: 'http://localhost:3000/dashboard?success=false',
//       });
  
//       return res.status(200).json({ checkoutUrl: session.url });
//     } catch (error) {
//       console.error('Error during checkout:', error);
//       return res.status(500).json({ error: 'Could not create checkout session' });
//     }
// });
  
// // Generate a Stripe customer portal session
// router.post('/generate-portal', async (req, res) => {
//     try {
//       const { stripeCustomerId } = req.body;  // Get Stripe customer ID from the request
  
//       if (!stripeCustomerId) {
//         return res.status(400).json({ error: 'Stripe Customer ID is required' });
//       }
  
//       const portalSession = await stripe.billingPortal.sessions.create({
//         customer: stripeCustomerId,
//         return_url: 'http://localhost:3000/settings',
//       });
  
//       return res.status(200).json({ portalUrl: portalSession.url });
//     } catch (error) {
//       console.error('Error generating portal session:', error);
//       return res.status(500).json({ error: 'Could not generate customer portal' });
//     }
// });

// export default router;