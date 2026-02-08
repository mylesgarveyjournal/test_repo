import React, { useEffect, useState } from 'react';
import dataProvider from '../api/dataProvider';

export default function Home() {
  const [strains, setStrains] = useState([]);

  useEffect(() => {
    let mounted = true;
    dataProvider.getStrains().then(list => {
      if (mounted) setStrains(list);
    });
    return () => { mounted = false };
  }, []);

  return (
    <div>
      <h1>Welcome to Cannaverum</h1>
      <p>This starter site is themed to pair with your logo — earthy greens, gold accents, and a warm cream background.</p>

      <section>
        <h2>Featured Strains</h2>
        <ul>
          {strains.slice(0,3).map(s => (
            <li key={s.id}><strong>{s.name}</strong> — {s.type}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
