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

  const products = [
    {
      name: 'Quilted Country Jacket',
      category: 'Women',
      price: 129,
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Wool Weekend Jumper',
      category: 'Knitwear',
      price: 74,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Family Raincoat',
      category: 'Outerwear',
      price: 96,
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', background: '#fbfaf7', color: '#1f2a24' }}>
      <div style={{ background: '#102d24', color: 'white', padding: '10px 32px', textAlign: 'center', fontWeight: 700 }}>
        Free UK delivery over £50 | New countryside collection now live
      </div>

      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '22px 48px',
        background: 'white',
        borderBottom: '1px solid #ddd',
        color: '#102d24'
      }}>
        <h1 style={{ margin: 0, fontSize: 30 }}>Harbour & Home UK</h1>
        <div style={{ display: 'flex', gap: 24, fontWeight: 700 }}>
          <span>Women</span>
          <span>Kids</span>
          <span>Home</span>
          <span>Outdoor</span>
          <span>Sale</span>
        </div>
        <strong>Basket ({basket})</strong>
      </nav>

      <section style={{
        padding: '70px 48px',
        background: '#efe4d3',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 36,
        alignItems: 'center'
      }}>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, color: '#284437' }}>
            UKI mid-market retail demo
          </p>
          <h2 style={{ fontSize: 52, margin: '10px 0', color: '#102d24', lineHeight: 1.05 }}>
            British countryside style for busy family life
          </h2>
          <p style={{ fontSize: 20, maxWidth: 650, color: '#263b31', lineHeight: 1.6, fontWeight: 500 }}>
            A mock high-traffic e-commerce retailer serving middle-class families,
            where checkout reliability directly affects customer experience and revenue.
          </p>
          <button
            onClick={() => logEvent('Hero collection clicked', {
              journey: 'homepage',
              action: 'hero_collection_click',
              campaign: 'country_collection',
            })}
            style={buttonStyle}
          >
            Shop new collection
          </button>
        </div>

        <div style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 360,
          borderRadius: 24,
          boxShadow: '0 18px 40px rgba(0,0,0,0.18)'
        }} />
      </section>

      <section style={{ padding: '44px 48px', background: 'white' }}>
        <div style={{ background: '#f3f7f2', border: '1px solid #c7d8cc', borderRadius: 18, padding: 24 }}>
          <h2 style={{ marginTop: 0, color: '#102d24' }}>Retail health story</h2>
          <p style={{ fontSize: 18, color: '#263b31', fontWeight: 600 }}>
            High traffic plus checkout errors can mean lost revenue, frustrated customers, and pressure on engineering teams.
          </p>
          <p style={{ fontSize: 18 }}><strong>Status:</strong> {status}</p>
        </div>
      </section>

      <section style={{ padding: '48px' }}>
        <h2 style={{ color: '#102d24', fontSize: 34 }}>Featured family favourites</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {products.map((product) => (
            <div key={product.name} style={cardStyle}>
              <div style={{
                height: 230,
                backgroundImage: `url('${product.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 16,
                marginBottom: 16
              }} />
              <p style={{ color: '#52665a', fontWeight: 700 }}>{product.category}</p>
              <h3 style={{ color: '#102d24', fontSize: 24 }}>{product.name}</h3>
              <p style={{ fontSize: 20, fontWeight: 800 }}>£{product.price}</p>
              <button
                onClick={() => {
                  setBasket(basket + 1);
                  logEvent('Add to basket', {
                    journey: 'checkout',
                    action: 'add_to_basket',
                    product: product.name,
                    value_gbp: product.price,
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

      <section style={{ padding: '48px', background: '#fffaf1' }}>
        <h2 style={{ color: '#102d24' }}>Checkout reliability demo controls</h2>
        <p style={{ color: '#263b31', fontSize: 18, fontWeight: 600 }}>
          Use these to create Datadog events that map to real retail business impact.
        </p>

        <button onClick={() => logEvent('Successful checkout', {
          journey: 'checkout',
          action: 'checkout_success',
          value_gbp: 129,
          customer_segment: 'returning_family_customer',
        })} style={buttonStyle}>
          Successful checkout
        </button>

        <button onClick={() => {
          datadogLogs.logger.error('Failed checkout', {
            journey: 'checkout',
            action: 'checkout_failed',
            reason: 'payment_authorisation_failed',
            value_gbp: 129,
          });
          setStatus('Failed checkout event sent');
        }} style={dangerButtonStyle}>
          Failed checkout
        </button>

        <button onClick={() => logEvent('Slow checkout experience', {
          journey: 'checkout',
          action: 'slow_checkout',
          duration_ms: 4200,
          value_gbp: 129,
        })} style={buttonStyle}>
          Slow checkout
        </button>
      </section>

      <section style={{ padding: '48px', background: '#102d24', color: 'white' }}>
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
  background: '#102d24',
  color: 'white',
  border: 0,
  borderRadius: 10,
  padding: '13px 18px',
  marginRight: 12,
  marginTop: 12,
  cursor: 'pointer',
  fontWeight: 800,
};

const dangerButtonStyle = {
  ...buttonStyle,
  background: '#b42318',
};

const cardStyle = {
  background: 'white',
  borderRadius: 20,
  padding: 22,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
};
