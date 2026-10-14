/**
 * Utilitários compartilhados entre as versões React e Vue.
 * Mantêm a mesma regra de negócio nas duas implementações.
 */

/** Faixa de preço aceita. A mesma regra vai para o CHECK do banco (Fase 3). */
export const PRICE_MIN = 50;
export const PRICE_MAX = 60000;

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

/** Retorna true se o preço é exibível (número dentro da faixa válida). */
export function isValidPrice(price) {
  return typeof price === 'number' && Number.isFinite(price) && price >= PRICE_MIN && price <= PRICE_MAX;
}

/**
 * Formata o preço em BRL. Valores ausentes ou fora da faixa viram "Consulte",
 * para nunca exibir algo como "R$ 8.408.408,00".
 */
export function formatPrice(price) {
  return isValidPrice(price) ? brl.format(price) : 'Consulte';
}

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function waLink(number, message = '') {
  const digits = String(number).replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

/** Quebra um texto em palavras para a animação de revelação. */
export function splitWords(text = '') {
  return text.split(/\s+/).filter(Boolean);
}

/** Retorna a seção visível pela chave, ou null. */
export function getSection(sections, key) {
  const section = sections.find((s) => s.key === key);
  return section && section.visible ? section : null;
}
