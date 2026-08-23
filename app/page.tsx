'use client';

import { useEffect, useState } from 'react';
import { datadogLogs } from '@datadog/browser-logs';

export default function Page() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('Open this deployed app and click a button to send a log to Datadog.');

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN) {
      setStatus('Add your Datadog client token in Vercel Environment Variables first.');
      return;
    }

    datadogLogs.init({
      clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
      site: process.env.NEXT_PUBLIC_DATADOG_SITE || 'datadoghq.com',
      service: 'vercel-datadog-demo',
      env: 'demo',
      forwardErrorsToLogs: true,
      sessionSampleRate: 100
    });

    datadogLogs.logger.info('Demo app loaded on Vercel', { product: 'vercel', observability: 'datadog' });
    setStatus('Datadog logging is ready. Click a button, then search service:vercel-datadog-demo in Datadog Logs.');
  }, []);

  function sendLog() {
    const next = count + 1;
    setCount(next);
    datadogLogs.logger.info('Hiring manager demo button clicked', { clicks: next, source: 'vercel-app' });
    setStatus(`Sent log #${next} to Datadog.`);
  }

  function sendError() {
    datadogLogs.logger.error('Demo error event for Datadog', { reason: 'User clicked test error button' });
    setStatus('Sent a test error log to Datadog.');
  }

  return (
    <main>
      <section className="card">
        <h1>Vercel + Datadog Demo</h1>
        <p>
          This small app is hosted on Vercel and sends browser logs to Datadog.
          It proves I tried both products: deployment, environment variables, and log search.
        </p>
        <button onClick={sendLog}>Send Datadog log</button>
        <button className="secondary" onClick={sendError}>Send test error</button>
        <div className="status">{status}</div>
        <p>Datadog search to show: <code>service:vercel-datadog-demo</code></p>
      </section>
    </main>
  );
}
