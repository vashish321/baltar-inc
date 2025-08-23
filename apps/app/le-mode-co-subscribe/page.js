'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getApiEndpoint } from '@/lib/config';
import HeaderComponent from '../components/LeModeCoComponent/HeaderComponent/Header';
import FooterComponent from '../components/LeModeCoComponent/FooterComponent/Footer';
import styles from './SubscribePage.module.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz');

export default function SubscribePage() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/le-mode-co/packages'));
      const result = await response.json();
      
      if (result.success) {
        setPackages(result.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <HeaderComponent />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading subscription packages...</p>
        </div>
        <FooterComponent />
      </>
    );
  }

  return (
    <>
      <HeaderComponent />
      <div className={styles.subscribeContainer}>
        <div className={styles.hero}>
          <h1>Choose Your Fashion Journey</h1>
          <p>Discover curated fashion boxes tailored to your style</p>
        </div>

        {!selectedPackage ? (
          <PackageSelection 
            packages={packages} 
            onSelectPackage={setSelectedPackage}
          />
        ) : (
          <Elements stripe={stripePromise}>
            <SubscriptionForm 
              selectedPackage={selectedPackage}
              onBack={() => setSelectedPackage(null)}
            />
          </Elements>
        )}
      </div>
      <FooterComponent />
    </>
  );
}

// Package Selection Component
function PackageSelection({ packages, onSelectPackage }) {
  return (
    <section className={styles.packageSelection}>
      <h2>Select Your Package</h2>
      <div className={styles.packagesGrid}>
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className={`${styles.packageCard} ${pkg.isPopular ? styles.popular : ''}`}
            onClick={() => onSelectPackage(pkg)}
          >
            {pkg.isPopular && <div className={styles.badge}>Most Popular</div>}
            <h3>{pkg.name}</h3>
            <div className={styles.price}>${pkg.price}/month</div>
            <p className={styles.description}>{pkg.description}</p>
            <ul className={styles.features}>
              {pkg.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
            <div className={styles.bestFor}>Perfect for: {pkg.bestFor}</div>
            <button className={styles.selectBtn}>Select Package</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// Subscription Form Component
function SubscriptionForm({ selectedPackage, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    zipCode: '',
    address: ''
  });
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Create subscription
      const subscriptionResponse = await fetch(getApiEndpoint('/api/le-mode-co/subscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          packageId: selectedPackage.id
        })
      });

      const subscriptionResult = await subscriptionResponse.json();
      
      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error);
      }

      // Create payment intent
      const paymentResponse = await fetch(getApiEndpoint('/api/le-mode-co/create-payment-intent'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscriptionResult.subscription.id
        })
      });

      const paymentResult = await paymentResponse.json();
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error);
      }

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResult.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await fetch(getApiEndpoint('/api/le-mode-co/confirm-payment'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id
          })
        });

        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Welcome to Le Mode Co!</h2>
          <p>Your subscription to <strong>{selectedPackage.name}</strong> has been activated successfully.</p>
          <p>You'll receive your first curated fashion box within 5-7 business days.</p>
          <div className={styles.successActions}>
            <button 
              className={styles.homeBtn}
              onClick={() => window.location.href = '/le-mode-co'}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Packages
        </button>
        <div className={styles.selectedPackage}>
          <h3>{selectedPackage.name}</h3>
          <span>${selectedPackage.price}/month</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.subscriptionForm}>
        <div className={styles.formSection}>
          <h4>Personal Information</h4>
          
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h4>Shipping Information</h4>
          
          <div className={styles.formGroup}>
            <label htmlFor="address">Full Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="zipCode">ZIP Code *</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h4>Payment Information</h4>
          <div className={styles.cardElement}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formActions}>
          <div className={styles.total}>
            <span>Total: ${selectedPackage.price}/month</span>
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!stripe || processing}
          >
            {processing ? 'Processing...' : `Subscribe for $${selectedPackage.price}/month`}
          </button>
        </div>
      </form>
    </div>
  );
}
