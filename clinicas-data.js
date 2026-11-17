/* Serviço de dados compartilhado das Clínicas Positivo.
   Contrato: ClinicasData.open(clinic) -> { load(), persist(list), reset() }.
   Hoje usa localStorage; trocar por API exige apenas reimplementar este arquivo. */
(function () {
  const KEY = 'clinicas-positivo:v2';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { records: [], migrated: {} }; } catch { return { records: [], migrated: {} }; } };
  const write = db => { try { localStorage.setItem(KEY, JSON.stringify(db)); return true; } catch { return false; } };

  // Migração idempotente: lê a chave antiga, guarda cópia (uma vez) e referencia origem + ID antigo.
  function migrate(clinic) {
    const db = read();
    if (db.migrated[clinic]) return db;
    const old = localStorage.getItem('clinicas-positivo:' + clinic);
    if (old) {
      try {
        const bk = 'clinicas-positivo:backup:' + clinic;
        if (!localStorage.getItem(bk)) localStorage.setItem(bk, old);
        JSON.parse(old).forEach(r => {
          const ref = clinic + ':' + (r.__backendId || r.entity_id);
          if (!db.records.some(x => x.legacyRef === ref)) db.records.push({ ...r, clinic, legacyRef: ref, origin: { clinic, id: r.entity_id } });
        });
      } catch { /* chave antiga corrompida: backup preservado, nada migrado */ }
    }
    db.migrated[clinic] = new Date().toISOString();
    write(db);
    return db;
  }

  window.ClinicasData = {
    open(clinic) {
      return {
        load: () => migrate(clinic).records.filter(r => r.clinic === clinic),
        persist(list, shared) { // 'shared' (opcional) grava registros compartilhados na MESMA escrita
          const db = migrate(clinic); db.records = [...db.records.filter(r => r.clinic !== clinic && (shared === undefined || r.clinic !== 'shared')), ...list.map(r => ({ ...r, clinic })), ...(shared || []).map(r => ({ ...r, clinic: 'shared' }))]; return write(db); },
        reset() { const db = read(); db.records = db.records.filter(r => r.clinic !== clinic); return write(db); }
      };
    },
    shared() { return { load: () => read().records.filter(r => r.clinic === 'shared'), persist(list) { const db = read(); db.records = [...db.records.filter(r => r.clinic !== 'shared'), ...list.map(r => ({ ...r, clinic: 'shared' }))]; return write(db); } }; },
    // Possíveis duplicidades para conferência administrativa: mesmo nome E mesmo telefone em origens diferentes.
    duplicates() {
      const p = read().records.filter(r => r.entity_type === 'paciente'), out = [];
      p.forEach((a, i) => p.slice(i + 1).forEach(b => {
        const ta = JSON.parse(a.payload || '{}').telefone, tb = JSON.parse(b.payload || '{}').telefone;
        if (a.clinic !== b.clinic && a.title.toLowerCase() === b.title.toLowerCase() && ta && ta === tb) out.push([a, b]);
      }));
      return out;
    }
  };
})();
