'use client';

import { useEffect, useState } from 'react';
import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';

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

    datadogRum.init({
      applicationId: process.env.NEXT_PUBLIC_DATADOG_RUM_APPLICATION_ID || '',
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || '',
      site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.eu',
      service: 'vercel-datadog-demo',
      env: 'demo',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackResources: true,
      trackUserInteractions: true,
      trackLongTasks: true,
    });

    datadogLogs.logger.info('Retail demo loaded', {
      market: 'UKI',
      segment: 'mid-market',
      customer_profile: 'middle_class_families',
      monthly_visitors: 'high_traffic_demo',
    });
  }, []);

  function logEvent(message: string, context: object) {
    datadogLogs.logger.info(message, context);
    setStatus(message);
  }

  const product = 'Luxury Linen Bedding Set';
  const price = 89;

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', background: '#f7f3ee', color: '#243024' }}>
      <div style={{ background: '#183b32', color: 'white', padding: '10px 32px', textAlign: 'center' }}>
        Free UK delivery over £50 | Summer home refresh sale now live
      </div>

      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '22px 48px',
        background: 'white',
        borderBottom: '1px solid #ddd'
      }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Harbour & Home UK</h1>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>Home</span>
          <span>Bedding</span>
          <span>Kitchen</span>
          <span>Kids</span>
          <span>Sale</span>
        </div>
        <strong>Basket ({basket})</strong>
      </nav>

      <section style={{
        padding: '60px 48px',
        background: '#eadfce',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 32
      }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: 2 }}>UKI mid-market retail demo</p>
          <h2 style={{ fontSize: 48, margin: '10px 0' }}>Everyday homeware for busy family homes</h2>
          <p style={{ fontSize: 18, maxWidth: 620 }}>
            A mock e-commerce site for a high-traffic UK retailer serving middle-class families,
            where checkout reliability directly impacts customer experience and revenue.
          </p>
          <button
            onClick={() => logEvent('Hero sale banner clicked', {
              journey: 'homepage',
              action: 'hero_banner_click',
              campaign: 'summer_home_refresh',
            })}
            style={buttonStyle}
          >
            Shop the sale
          </button>
        </div>

        <div style={{ background: 'white', padding: 28, borderRadius: 18 }}>
          <h3>Today’s retail health story</h3>
          <p>High traffic + checkout errors = revenue risk.</p>
          <p><strong>Status:</strong> {status}</p>
        </div>
      </section>

      <section style={{ padding: '48px' }}>
        <h2>Featured family favourites</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24
        }}>
          {[
            ['Luxury Linen Bedding Set', 'Bedding', 89],
            ['Stoneware Dinner Set', 'Kitchen', 64],
            ['Kids Cotton Storage Baskets', 'Kids', 32],
          ].map(([name, category, value]) => (
            <div key={name} style={cardStyle}>
              <div style={{
                height: 150,
                background: '#d8c7b4',
                borderRadius: 14,
                marginBottom: 16
              }} />
              <p style={{ color: '#6b6b6b' }}>{category}</p>
              <h3>{name}</h3>
              <p>£{value}</p>
              <button
                onClick={() => {
                  setBasket(basket + 1);
                  logEvent('Add to basket', {
                    journey: 'checkout',
                    action: 'add_to_basket',
                    product: name,
                    value_gbp: value,
                  });
                }}
                style={buttonStyle}
              >
                Add to basket
              </button>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '48px', background: 'white' }}>
        <h2>Checkout reliability demo controls</h2>
        <p>Use these to create Datadog events that map to real retail business impact.</p>

        <button onClick={() => logEvent('Successful checkout', {
          journey: 'checkout',
          action: 'checkout_success',
          value_gbp: price,
          customer_segment: 'returning_family_customer',
        })} style={buttonStyle}>
          Successful checkout
        </button>

        <button onClick={() => {
          datadogLogs.logger.error('Failed checkout', {
            journey: 'checkout',
            action: 'checkout_failed',
            reason: 'payment_authorisation_failed',
            value_gbp: price,
          });
          setStatus('Failed checkout event sent');
        }} style={dangerButtonStyle}>
          Failed checkout
        </button>

        <button onClick={() => logEvent('Slow checkout experience', {
          journey: 'checkout',
          action: 'slow_checkout',
          duration_ms: 4200,
          value_gbp: price,
        })} style={buttonStyle}>
          Slow checkout
        </button>
      </section>

      <section style={{ padding: '48px', background: '#183b32', color: 'white' }}>
        <h2>What this proves in Datadog</h2>
        <ul>
          <li>Logs capture checkout events and errors.</li>
          <li>RUM captures real browser experience and user interactions.</li>
          <li>A mid-market retailer can connect technical issues to revenue risk.</li>
        </ul>
        <p>Logs search: <code>service:vercel-datadog-demo checkout</code></p>
      </section>
    </main>
  );
}

const buttonStyle = {
  background: '#183b32',
  color: 'white',
  border: 0,
  borderRadius: 8,
  padding: '12px 18px',
  marginRight: 12,
  cursor: 'pointer',
  fontWeight: 700,
};

const dangerButtonStyle = {
  ...buttonStyle,
  background: '#b42318',
};

const cardStyle = {
  background: 'white',
  borderRadius: 18,
  padding: 22,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};
