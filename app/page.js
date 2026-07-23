'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [tab, setTab] = useState('exams');
  
  // États pour les filtres
  const [semestres, setSemestres] = useState([]);
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [filieres, setFilieres] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [examens, setExamens] = useState([]);

  // États pour la publication d'examen
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    semestre_id: '',
    filiere_id: '',
    module_id: '',
    professeur_nom: '',
    type_examen: 'Final',
    annee: '2024-2025',
    fichier_url: '',
    nom_contributeur: ''
  });

  // États pour le Calculateur
  const [calcSemestre, setCalcSemestre] = useState('');
  const [calcFiliere, setCalcFiliere] = useState('');
  const [calcModules, setCalcModules] = useState([]);
  const [notes, setNotes] = useState({});

  // 1. Charger les semestres au démarrage
  useEffect(() => {
    async function loadSemestres() {
      const { data } = await supabase.from('semestres').select('*').order('id');
      if (data) setSemestres(data);
    }
    loadSemestres();
  }, []);

  // 2. Charger les filières quand un semestre est sélectionné
  useEffect(() => {
    if (!selectedSemestre) {
      setFilieres([]);
      setModules([]);
      return;
    }
    async function loadFilieres() {
      const { data } = await supabase
        .from('filieres')
        .select('*')
        .eq('semestre_id', selectedSemestre);
      if (data) setFilieres(data);
    }
    loadFilieres();
  }, [selectedSemestre]);

  // 3. Charger les modules
  useEffect(() => {
    if (!selectedFiliere) {
      setModules([]);
      return;
    }
    async function loadModules() {
      const { data } = await supabase
        .from('modules')
        .select('*')
        .eq('filiere_id', selectedFiliere);
      if (data) setModules(data);
    }
    loadModules();
  }, [selectedFiliere]);

  // 4. Rechercher les examens
  useEffect(() => {
    async function searchExamens() {
      let query = supabase.from('examens').select('*, modules(nom), professeurs(nom_complet)');
      if (selectedModule) {
        query = query.eq('module_id', selectedModule);
      }
      const { data } = await query;
      if (data) setExamens(data);
    }
    searchExamens();
  }, [selectedModule]);

  // Gestion du calculateur
  useEffect(() => {
    if (!calcFiliere) return;
    async function loadCalcModules() {
      const { data } = await supabase.from('modules').select('*').eq('filiere_id', calcFiliere);
      if (data) setCalcModules(data);
    }
    loadCalcModules();
  }, [calcFiliere]);

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
      {/* HEADER */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
            <span style={{ color: '#fbbf24' }}>ENCG</span> Exams Hub
          </h1>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>École Nationale de Commerce et de Gestion - Casablanca</span>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          ➕ Publier un Examen
        </button>
      </header>

      {/* NAVIGATION */}
      <nav style={{ backgroundColor: 'white', display: 'flex', borderBottom: '1px solid #e2e8f0', justifyContent: 'center' }}>
        <button onClick={() => setTab('exams')} style={{ padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'exams' ? 'bold' : 'normal', borderBottom: tab === 'exams' ? '3px solid #0f172a' : 'none', color: tab === 'exams' ? '#0f172a' : '#64748b' }}>
          📚 Bibliothèque d'Examens
        </button>
        <button onClick={() => setTab('calculator')} style={{ padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'calculator' ? 'bold' : 'normal', borderBottom: tab === 'calculator' ? '3px solid #0f172a' : 'none', color: tab === 'calculator' ? '#0f172a' : '#64748b' }}>
          📊 Calculateur de Notes
        </button>
        <button onClick={() => setTab('news')} style={{ padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'news' ? 'bold' : 'normal', borderBottom: tab === 'news' ? '3px solid #0f172a' : 'none', color: tab === 'news' ? '#0f172a' : '#64748b' }}>
          📢 Absences & News
        </button>
        <button onClick={() => setTab('schedule')} style={{ padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: tab === 'schedule' ? 'bold' : 'normal', borderBottom: tab === 'schedule' ? '3px solid #0f172a' : 'none', color: tab === 'schedule' ? '#0f172a' : '#64748b' }}>
          📅 Emploi du Temps
        </button>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main style={{ maxWidth: '900px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* PILIER 1 : BIBLIOTHÈQUE D'EXAMENS */}
        {tab === 'exams' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px', color: '#0f172a' }}>🔍 Filtrer les Examens</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>1. SEMESTRE</label>
                  <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    value={selectedSemestre}
                    onChange={(e) => setSelectedSemestre(e.target.value)}
                  >
                    <option value="">Sélectionner...</option>
                    {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>2. FILIÈRE</label>
                  <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    value={selectedFiliere}
                    onChange={(e) => setSelectedFiliere(e.target.value)}
                    disabled={!selectedSemestre}
                  >
                    <option value="">Sélectionner...</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>3. MATIÈRE</label>
                  <select 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    disabled={!selectedFiliere}
                  >
                    <option value="">Toutes les matières</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* RÉSULTATS */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>📄 Examens Disponibles</h3>
              {examens.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', margin: '32px 0' }}>Aucun examen ne correspond à ces critères pour le moment.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {examens.map(ex => (
                    <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <div>
                        <strong>{ex.modules?.nom}</strong> - {ex.type_examen} ({ex.annee_universitaire})
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Prof : {ex.professeurs?.nom_complet || 'Non spécifié'} | Publié par : {ex.nom_contributeur || 'Anonyme'}</div>
                      </div>
                      <a href={ex.fichier_url} target="_blank" rel="noreferrer" style={{ backgroundColor: '#0f172a', color: 'white', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>
                        📥 Télécharger PDF
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PILIER 2 : CALCULATEUR DE NOTES */}
        {tab === 'calculator' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px' }}>📊 Calculateur de Moyenne Semestrielle</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Semestre</label>
                <select 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  onChange={(e) => {
                    const semId = e.target.value;
                    supabase.from('filieres').select('*').eq('semestre_id', semId).then(({ data }) => setFilieres(data || []));
                  }}
                >
                  <option value="">Sélectionner...</option>
                  {semestres.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Filière</label>
                <select 
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  value={calcFiliere}
                  onChange={(e) => setCalcFiliere(e.target.value)}
                >
                  <option value="">Sélectionner...</option>
                  {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
              </div>
            </div>

            {calcModules.length > 0 && (
              <div>
                {calcModules.map((m) => (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{m.nom}</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="20" 
                      placeholder="/ 20" 
                      style={{ width: '70px', padding: '6px', textAlign: 'center', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      onChange={(e) => handleNoteChange(m.id, e.target.value)}
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
          </div>
        )}

        {/* PILIER 3 : ABSENCES & NEWS */}
        {tab === 'news' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px' }}>📢 Fil d'Actualités & Absences</h2>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', color: '#92400e', fontSize: '13px', marginBottom: '20px' }}>
              🔒 <strong>Sécurité :</strong> Seuls les délégués de classe identifiés ont la possibilité de publier des alertes officielles.
            </div>

            <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>🚨 Absence Professeur</span>
                <span>Aujourd'hui à 08h30</span>
              </div>
              <h4 style={{ margin: '8px 0 4px 0' }}>Pr. RHARIB - Micro-Économie</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>Le cours prévu ce matin à 08h00 en Amphi 1 est annulé. Une séance de rattrapage sera fixée ultérieurement.</p>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px' }}>Groupe : S1-A | Publié par : Délégué S1-A</div>
            </div>
          </div>
        )}

        {/* PILIER 4 : EMPLOI DU TEMPS */}
        {tab === 'schedule' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px' }}>📅 Mon Emploi du Temps Dynamique</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Consultez votre planning hebdomadaire extrait des documents officiels de l'ENCG Casablanca.</p>
            <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              Sélectionnez votre groupe (ex: S1-A, S5-Gestion) pour afficher le planning complet de la semaine.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
