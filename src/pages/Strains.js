import React, { useEffect, useState } from 'react';
import dataProvider from '../api/dataProvider';

export default function Strains(){
  const [strains, setStrains] = useState([]);
  const [q, setQ] = useState('');

  useEffect(()=>{
    let mounted = true;
    dataProvider.getStrains().then(list => { if(mounted) setStrains(list); });
    return ()=>{ mounted = false };
  },[]);

  const filtered = strains.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || (s.type||'').toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="hero container">
        <div className="logo-large"><img src="/logo.png" alt="logo" className="logo"/></div>
        <div>
          <h1>Strains</h1>
          <p className="muted">Explore strains, lineage, and quick notes. Data is local JSON for now.</p>
          <div className="search">
            <input placeholder="Search strains or type..." value={q} onChange={e=>setQ(e.target.value)} />
            <div className="pill">{filtered.length}</div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="card-grid">
          {filtered.map(s=> (
            <article className="card" key={s.id}>
              <h3>{s.name} <small className="muted">— {s.type}</small></h3>
              <p className="muted">{s.description || s.notes}</p>
              <div style={{marginTop:12}}>
                <strong>THC:</strong> {s.thc || '—'} &nbsp; <strong>CBD:</strong> {s.cbd || '—'}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
