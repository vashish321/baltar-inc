const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const LeModeCoService = require('../services/leModeCoService');

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Confirm the subscription payment
        await LeModeCoService.confirmPayment(paymentIntent.id);
        console.log('Subscription activated for payment:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        // Update subscription status to failed
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        await prisma.customerSubscription.updateMany({
          where: { stripePaymentId: failedPayment.id },
          data: {
            status: 'FAILED'
          }
        });
        break;

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object;
        console.log('Payment canceled:', canceledPayment.id);
        
        // Update subscription status to canceled
        await prisma.customerSubscription.updateMany({
          where: { stripePaymentId: canceledPayment.id },
          data: {
            status: 'CANCELLED'
          }
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;
