#!/usr/bin/env node
/*
 * FlyNoThink R4 — controllo pre-pubblicazione (versione pubblicabile).
 * Uso: node scripts/check-publish.mjs   → esce con 1 se manca qualcosa per pubblicare su flynothink.it.
 * Controlla solo ciò che si può controllare sui file: non sostituisce la prova reale del modulo,
 * la verifica dei consensi né la revisione legale.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const read = (f) => readFileSync(join(root, f), 'utf8');
const noComments = (h) => h.replace(/<!--[\s\S]*?-->/g, '');
const problems = [];
const add = (f, m) => problems.push(`${f}: ${m}`);
// Da completare dopo la pubblicazione (decisione del 19/10/2026): segnalati a ogni deploy, non bloccano.
const warnings = [];
const warn = (f, m) => warnings.push(`${f}: ${m}`);

const index = noComments(read('index.html'));
const grazie = noComments(read('grazie.html'));
const site = read('assets/js/site-config.js');
const form = read('assets/js/config.js');
const robots = read('robots.txt');
const text = index.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');

// 1. Nessun residuo di prova
for (const [f, h] of [['index.html', index], ['grazie.html', grazie]]) {
  if (/data-preview-banner/.test(h)) add(f, 'avviso di anteprima presente');
  if (/data-placeholder=/.test(h)) add(f, 'blocchi segnaposto presenti');
  if (/\bDEMO\b|modalità demo/i.test(h.replace(/<[^>]+>/g, ' '))) add(f, 'testo «demo» visibile');
}
const brackets = [...text.matchAll(/\[[^\]\n]{3,}\]/g)].map((m) => m[0]);
if (brackets.length) add('index.html', `testi tra parentesi quadre: ${brackets.slice(0, 3).join(' · ')}`);

// 2. Modulo MailerLite
if (!/accountId:\s*'?\d+'?/.test(form)) add('assets/js/config.js', 'MailerLite accountId mancante');
if (!/formId:\s*'?\d+'?/.test(form)) add('assets/js/config.js', 'MailerLite formId mancante');
if (/minAge:\s*null/.test(form)) add('assets/js/config.js', 'decisione sull\'età minima mancante (minAge)');

// 3. Documenti legali e titolare
for (const k of ['privacyPolicyUrl', 'cookiePolicyUrl'])
  if (!new RegExp(k + ":\\s*'https://").test(site)) add('assets/js/site-config.js', `legal.${k} mancante (URL iubenda)`);
if (!/termsUrl:\s*'https:\/\//.test(site)) warn('assets/js/site-config.js', 'legal.termsUrl mancante: link «Termini e Condizioni» nascosto finché manca');
const owner = index.match(/<p class="footer-4" data-owner-line( hidden)?>([^<]*)<\/p>/);
if (!owner || owner[1] || owner[2].trim().length < 10) warn('index.html', 'dati del titolare nel footer mancanti (riga data-owner-line)');

// 4. Tracciamento: spento, oppure con gestione consensi completa
if (/enabled:\s*true/.test(site)) {
  if (/siteId:\s*null|cookiePolicyId:\s*null|containerId:\s*null/.test(site) || /snippetVerificato:\s*false/.test(site))
    add('assets/js/site-config.js', 'tracciamento attivo senza gestione consensi completa');
}
if (!/env:\s*'production'/.test(site)) add('assets/js/site-config.js', "env non è 'production'");

// 5. Indicizzazione e condivisione
if (/<meta name="robots" content="noindex/.test(index)) add('index.html', 'noindex ancora presente');
if (!/<meta name="robots" content="noindex/.test(grazie)) add('grazie.html', 'deve restare noindex');
if (/Disallow:\s*\/\s*$/m.test(robots)) add('robots.txt', 'blocca tutto il sito');
if (!/<link rel="canonical" href="https:\/\/flynothink\.it\/">/.test(index)) add('index.html', 'canonical mancante');
if (!existsSync(join(root, 'assets/social/og-image.jpg'))) add('assets/social', 'og-image.jpg mancante');

// 6. Foto e dichiarazione AI
const pending = [...index.matchAll(/data-photo-status="(?!approvata")[^"]*"/g)].length;
if (pending) add('index.html', `${pending} fotografia/e non approvate`);
if (/data-rights="ai-illustrativa"/.test(index) && !/data-ai-disclosure/.test(index)) add('index.html', 'dichiarazione AI mancante');
if (/data-rights="da-confermare"/.test(index)) warn('index.html', 'diritti della foto del referente da confermare (data-rights)');

if (warnings.length) {
  console.warn(`\n⚠ Da completare (non bloccano la pubblicazione) — ${warnings.length}:\n`);
  for (const w of warnings) console.warn('  • ' + w);
  console.warn('');
}
// Su Vercel il blocco vale solo per la produzione: le anteprime (rami diversi da main) si pubblicano
// su un indirizzo *.vercel.app che Vercel esclude dai motori di ricerca.
const vercelEnv = process.env.VERCEL_ENV;
if (problems.length && vercelEnv && vercelEnv !== 'production') {
  console.warn(`\n⚠ Anteprima (${vercelEnv}): ${problems.length} dati ancora mancanti per la produzione:\n`);
  for (const p of problems) console.warn('  • ' + p);
  console.warn('');
  process.exit(0);
}
if (problems.length) {
  console.error(`\n✖ Pubblicazione BLOCCATA — ${problems.length} problemi:\n`);
  for (const p of problems) console.error('  • ' + p);
  console.error('');
  process.exit(1);
}
console.log('✔ Nessun blocco sui file. Prima di aprire: prova reale del modulo, verifica su telefoni, revisione dei testi legali.');
