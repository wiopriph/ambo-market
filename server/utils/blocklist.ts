import type { SupabaseClient } from '@supabase/supabase-js';


type BlocklistEntry = { kind: 'phone' | 'text'; value: string };

export type BlocklistMatch = { kind: string; value: string };

/** Только цифры: '+244 944-123-456' → '244944123456'. */
export const digitsOnly = (value: string) => value.replace(/\D/g, '');

/**
 * Цифровые последовательности текста, устойчивые к форматированию:
 * разделители между цифрами (пробел, дефис, точка и т.п.) схлопываются,
 * так что «944 123 456» и «944-12-34-56» дают одну последовательность.
 */
export function digitSequences(text: string): string[] {
  return (text.replace(/(\d)[\s\-.()/*_]+(?=\d)/g, '$1').match(/\d{7,}/g)) ?? [];
}

/**
 * Проверка телефона и/или текста по блоклисту.
 * Телефоны матчатся вхождением: blocked '944123456' ловит и '+244944123456'.
 */
export async function checkBlocklist(
  client: SupabaseClient,
  input: { phone?: string | null; text?: string | null },
): Promise<BlocklistMatch | null> {
  const { data: entries } = await client
    .from('blocklist')
    .select('kind, value');

  if (!entries?.length) {
    return null;
  }

  const phoneDigits = input.phone ? digitsOnly(input.phone) : '';
  const textLower = (input.text ?? '').toLowerCase();
  const textDigits = input.text ? digitSequences(input.text) : [];

  for (const entry of entries as BlocklistEntry[]) {
    if (entry.kind === 'phone') {
      const blocked = digitsOnly(entry.value);

      if (!blocked) continue;

      if (phoneDigits && (phoneDigits.includes(blocked) || blocked.includes(phoneDigits))) {
        return entry;
      }

      if (textDigits.some(sequence => sequence.includes(blocked))) {
        return entry;
      }
    }

    if (entry.kind === 'text' && textLower.includes(entry.value.toLowerCase())) {
      return entry;
    }
  }

  return null;
}
