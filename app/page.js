'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [tab, setTab] = useState('exams');
  const [semestres, setSemestres] = useState([]);
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const fetchSemestres = async () => {
      const { data } = await supabase.from('semestres').select('*').order('id');
      if (data) setSemestres(data);
    };
    fetchSemestres();
  }, []);

  const handleNoteChange = (modId, val) => {
    setNotes({ ...notes, [modId]: parseFloat(val) || 0 });
  };

  const calculerMoyenne = () => {
    const vals = Object.values(notes);
    if (vals.length === 0) return '0.00';
    const sum = vals.reduce((a, b) => a + b, 0);
    return (sum / vals.length).toFixed(2);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', margin: 0 }}>
      {/* Header */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <span style={{ color: '#fbbf24' }}>ENCG</span> Exams Hub - Casablanca
        </h1>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ backgroundColor: 'white', display: 'flex', borderBottom: '1px solid #e2e8f0', justifyContent: 'center' }}>
        <button onClick={() => setTab('exams')} style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'exams' ? 'bold' : 'normal', borderBottom: tab === 'exams' ? '3px solid #0f172a' : 'none' }}>
          📚 Examens
        </button>
        <button onClick={() => setTab('calculator')} style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'calculator' ? 'bold' : 'normal', borderBottom: tab === 'calculator' ? '3px solid #0f172a' : 'none' }}>
          📊 Calculateur Notes
        </button>
        <button onClick={() => setTab('news')} style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'news' ? 'bold' : 'normal', borderBottom: tab === 'news' ? '3px solid #0f172a' : 'none' }}>
          📢 Absences & News
        </button>
        <button onClick={() => setTab('schedule')} style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'schedule' ? 'bold' : 'normal', borderBottom: tab === 'schedule' ? '3px solid #0f172a' : 'none' }}>
          📅 Emploi du Temps
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '24px auto', padding: '0 16px' }}>
        {tab === 'exams' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>🔍 Rechercher un Examen</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Semestre</label>
              <select 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
              >
                <option value="">Sélectionner un semestre...</option>
                {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Sélectionnez un semestre pour consulter les sujets d'examens disponibles.</p>
          </div>
        )}

        {tab === 'calculator' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>📊 Calculateur de Moyenne Semestrielle</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Saisissez vos notes pour calculer votre moyenne générale :</p>
            
            {['Micro-Économie', 'Droit Général', 'Management', 'Comptabilité Générale 1', 'Mathématiques Appliquées'].map((mod, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{mod}</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  placeholder="/ 20"
                  style={{ width: '70px', padding: '6px', textAlign: 'center', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  onChange={(e) => handleNoteChange(idx, e.target.value)}
                />
              </div>
            ))}

            <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '16px', borderTop: '2px solid #e2e8f0' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>MOYENNE ESTIMÉE</span>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: parseFloat(calculerMoyenne()) >= 10 ? '#16a34a' : '#dc2626' }}>
                {calculerMoyenne()} / 20
              </div>
            </div>
          </div>
        )}

        {tab === 'news' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>📢 Fil d'Actualités & Absences</h2>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', color: '#92400e', fontSize: '13px', mb: '16px' }}>
              🔒 Seuls les délégués de classe identifiés ont la possibilité d'ajouter des alertes d'absence.
            </div>
          </div>
        )}

        {tab === 'schedule' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>📅 Mon Emploi du Temps</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Consultez votre emploi du temps pré-chargé selon votre groupe.</p>
          </div>
        )}
      </main>
    </div>
  );
}
