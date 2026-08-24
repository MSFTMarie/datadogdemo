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
            A mock high-tr
