'use client';

import { useEffect, useState } from 'react';
import { datadogLogs } from '@datadog/browser-logs';

export default function Page() {
  const [status, setStatus] = useState('Ready to simulate customer activity.');
  const [basket, setBasket] = useState(0);

  useEffect(() => {
    datadogLogs.init({
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
      site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.eu',
      service: 'vercel-datadog-demo',
      env: 'demo',
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
    });

    datadogLogs.logger.info('Retail demo loaded', {
      market: 'UKI',
      segment: 'mid-market',
      customer_profile: '4000-5000 customers',
    });
  }, []);

  function logEvent(message: string, context: object) {
    datadogLogs.logger.info(message, context);
    setStatus(message);
  }

  return (
    <main style={{ padding: 32, fontFamily: 'Arial, sans-serif' }}>
      <h1>Harbour & Home UK</h1>
      <p>Mock UKI mid-market e-commerce checkout reliability demo.</p>

      <h2>Featured product</h2>
      <div style={{ border: '1px solid #ddd', padding: 20, maxWidth: 420 }}>
        <h3>Luxury Linen Bedding Set</h3>
        <p>£89.00</p>
        <p>Basket items: {basket}</p>

        <button onClick={() => {
          setBasket(basket + 1);
          logEvent('Add to basket', {
            journey: 'checkout',
            action: 'add_to_basket',
            product: 'Luxury Linen Bedding Set',
            value_gbp: 89,
          });
        }}>
          Add to basket
        </button>

        <button onClick={() => logEvent('Successful checkout', {
          journey: 'checkout',
          action: 'checkout_success',
          value_gbp: 89,
          customer_segment: 'returning_customer',
        })}>
          Successful checkout
        </button>

        <button onClick={() => {
          datadogLogs.logger.error('Failed checkout', {
            journey: 'checkout',
            action: 'checkout_failed',
            reason: 'payment_authorisation_failed',
            value_gbp: 89,
          });
          setStatus('Failed checkout event sent');
        }}>
          Failed checkout
        </button>

        <button onClick={() => logEvent('Slow checkout experience', {
          journey: 'checkout',
          action: 'slow_checkout',
          duration_ms: 4200,
          value_gbp: 89,
        })}>
          Slow checkout
        </button>
      </div>

      <p><strong>Status:</strong> {status}</p>

      <h2>What this proves</h2>
      <ul>
        <li>Vercel hosts the customer-facing shopping experience.</li>
        <li>Datadog captures customer journey events.</li>
        <li>Logs can show revenue-impacting checkout issues.</li>
      </ul>

      <p>Datadog search: <code>service:vercel-datadog-demo checkout</code></p>
    </main>
  );
}
