/* Regras de persistência da clínica veterinária.
   Mantém o contrato load/persist/reset de ClinicasData, sem alterar outras clínicas. */
(function () {
  'use strict';

  const SURGERY_STATUSES = ['Programada', 'Em andamento', 'Concluída', 'Cancelada'];
  const readPayload = record => {
    try {
      const value = typeof record.payload === 'string' ? JSON.parse(record.payload || '{}') : record.payload;
      return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
    } catch { return {}; }
  };

  function parseWeight(value) {
    if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : NaN;
    const text = String(value ?? '').trim();
    if (!/^\d+(?:[.,]\d+)?(?:\s*kg)?$/i.test(text)) return NaN;
    const weight = Number(text.replace(/\s*kg$/i, '').replace(',', '.'));
    return Number.isFinite(weight) && weight > 0 ? weight : NaN;
  }

  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(value + 'T00:00:00.000Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function validTimestamp(value) {
    if (typeof value !== 'string') return false;
    const parts = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
    return !!parts && validDate(parts[1]) && Number(parts[2]) < 24 && Number(parts[3]) < 60 && Number(parts[4] || 0) < 60 && Number(parts[6] || 0) < 24 && Number(parts[7] || 0) < 60 && Number.isFinite(Date.parse(value));
  }

  function localDate(timestamp) {
    if (validDate(timestamp)) return timestamp;
    if (!validTimestamp(timestamp)) return '';
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date(timestamp));
    const get = type => parts.find(part => part.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  function legacyDischarge(value) {
    if (validTimestamp(value)) return new Date(value).toISOString();
    const parts = /^(\d{2})\/(\d{2})\/(\d{2}|\d{4}),?\s+(\d{2}):(\d{2})$/.exec(String(value || '').trim());
    if (!parts) return '';
    const year = parts[3].length === 2 ? '20' + parts[3] : parts[3];
    const timestamp = `${year}-${parts[2]}-${parts[1]}T${parts[4]}:${parts[5]}:00-03:00`;
    return validTimestamp(timestamp) ? new Date(timestamp).toISOString() : '';
  }

  function normalizeRecord(record) {
    const next = { ...record };
    const payload = readPayload(record);
    const legacy = !record.created_at;
    // Datas ausentes no legado permanecem desconhecidas quando não há fonte confiável.
    if (legacy && validTimestamp(record.updated_at)) {
      next.created_at = record.updated_at;
      next.created_at_estimated = true;
    }
    if (record.entity_type === 'paciente') {
      const weight = parseWeight(payload.peso);
      if (Number.isFinite(weight)) payload.peso = weight;
    }
    if (record.entity_type === 'exame' && legacy && !payload.requestedAt) {
      const date = localDate(next.created_at || record.updated_at);
      if (date) {
        payload.requestedAt = date;
        payload.requestedAtEstimated = true;
      }
    }
    if (record.entity_type === 'internamento' && !payload.dischargeAt && payload.dischargedAt) {
      const date = legacyDischarge(payload.dischargedAt);
      if (date) payload.dischargeAt = date;
    }
    next.payload = JSON.stringify(payload);
    return next;
  }

  function validateRecord(record, previousRecord) {
    const payload = readPayload(record);
    const fail = (field, error) => ({ isOk: false, field, error });
    if (record.created_at && !validTimestamp(record.created_at)) return fail('created_at', 'Data de inclusão inválida.');
    if (record.entity_type === 'paciente' && !Number.isFinite(parseWeight(payload.peso))) {
      return fail('peso', 'Informe um peso válido, maior que zero, em kg.');
    }
    if (record.entity_type === 'exame' && !validDate(payload.requestedAt)) {
      return fail('requestedAt', 'Informe uma data de solicitação válida.');
    }
    if (record.entity_type === 'cirurgia' && !SURGERY_STATUSES.includes(record.status)) {
      return fail('status', 'Selecione um status válido para a cirurgia.');
    }
    if (record.entity_type === 'cirurgia' && record.status === 'Cancelada') {
      if (typeof payload.cancelReason !== 'string' || !payload.cancelReason.trim()) {
        return fail('cancelReason', 'Informe o motivo do cancelamento da cirurgia.');
      }
      if (!validTimestamp(payload.canceledAt)) return fail('canceledAt', 'Informe a data e a hora do cancelamento.');
    }
    if (record.entity_type === 'internamento' && record.status === 'Alta clínica' && !validTimestamp(payload.dischargeAt)) {
      return fail('dischargeAt', 'Informe a data e a hora da alta clínica.');
    }
    if (record.entity_type === 'procedimento') {
      for (const field of ['admissionId', 'patientId', 'notes', 'professional']) {
        if (typeof payload[field] !== 'string' || !payload[field].trim()) {
          return fail(field, 'Informe o vínculo, o procedimento e o profissional responsável.');
        }
      }
      if (!validTimestamp(payload.performedAt)) return fail('performedAt', 'Informe a data e a hora do procedimento.');
    }
    if (record.entity_type === 'produto') {
      for (const field of ['stock', 'min']) {
        if (typeof payload[field] !== 'number' || !Number.isFinite(payload[field]) || payload[field] < 0) {
          return fail(field, 'Informe uma quantidade numérica, finita e não negativa.');
        }
      }
    }
    if (record.entity_type === 'movimento' &&
        (typeof payload.quantity !== 'number' || !Number.isFinite(payload.quantity) || payload.quantity <= 0)) {
      return fail('quantity', 'Informe uma quantidade numérica, finita e maior que zero.');
    }
    return { isOk: true, field: null, error: null };
  }

  // Comparação sem depender da ordem das propriedades do JSON ou do campo clinic
  // que ClinicasData acrescenta após a primeira escrita.
  function comparable(record) {
    const value = { ...record, payload: readPayload(record) };
    delete value.clinic;
    const sortKeys = item => {
      if (Array.isArray(item)) return item.map(sortKeys);
      if (!item || typeof item !== 'object') return item;
      return Object.fromEntries(Object.keys(item).sort().filter(key => item[key] !== undefined).map(key => [key, sortKeys(item[key])]));
    };
    return JSON.stringify(sortKeys(value));
  }

  function wrap(baseStore) {
    const service = {
      lastError: null,
      load() { return baseStore.load().map(normalizeRecord); },
      persist(records, shared) {
        service.lastError = null;
        if (!Array.isArray(records)) {
          service.lastError = { isOk: false, field: null, error: 'Lista de registros inválida.' };
          return false;
        }
        const previous = new Map(service.load().map(record => [record.entity_id, record]));
        const submitted = new Map(records.map(record => [record.entity_id, record]));
        const now = new Date().toISOString();
        const normalized = [];
        for (const input of records) {
          const before = previous.get(input.entity_id);
          // Registros novos recebem a data de inclusão antes de normalizar: assim,
          // a migração de exames antigos nunca completa uma solicitação nova vazia.
          const created = before ? before.created_at : (input.created_at || now);
          const next = normalizeRecord({ ...input, ...(created ? { created_at: created } : {}) });
          const changed = !before || comparable(next) !== comparable(before);
          if (changed) {
            const validation = validateRecord(next, before);
            if (!validation.isOk) {
              service.lastError = { ...validation, entity_id: input.entity_id };
              return false;
            }
            if (next.entity_type === 'procedimento' || (next.entity_type === 'prescricao' && readPayload(next).admissionId)) {
              const payload = readPayload(next);
              const admission = submitted.get(payload.admissionId) || previous.get(payload.admissionId);
              // Os exemplos iniciais pertencem à interface, não ao armazenamento.
              // Quando o internamento está disponível aqui, seu vínculo é validado.
              if (admission && (admission.entity_type !== 'internamento' || readPayload(admission).patientId !== payload.patientId)) {
                service.lastError = { isOk: false, field: 'admissionId', error: 'O procedimento ou cuidado deve pertencer ao internamento deste paciente.', entity_id: input.entity_id };
                return false;
              }
            }
            next.updated_at = validTimestamp(input.updated_at) ? input.updated_at : now;
          }
          normalized.push(next);
        }
        const saved = baseStore.persist(normalized, shared);
        if (!saved) service.lastError = { isOk: false, field: null, error: 'Não foi possível salvar. Verifique o armazenamento do navegador.' };
        return !!saved;
      },
      reset() {
        service.lastError = null;
        return baseStore.reset();
      }
    };
    return service;
  }

  window.MedVetData = { parseWeight, validDate, validTimestamp, normalizeRecord, validateRecord, wrap, surgeryStatuses: [...SURGERY_STATUSES] };
})();
