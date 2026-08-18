// Dependency-free CDP driver: launches headless Chrome, seeds localStorage,
// and screenshots the populated Overview, the Transactions table, and the modal.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import http from 'node:http';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = 'http://localhost:5173/';
const PORT = 9222;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SEED = [
  { id: 't1', description: 'Monthly Salary', amount: 4200, type: 'income', date: '2026-08-01', category: 'Salary' },
  { id: 't2', description: 'Freelance Project', amount: 1500, type: 'income', date: '2026-08-10', category: 'Freelance' },
  { id: 't3', description: 'Groceries', amount: 180.5, type: 'expense', date: '2026-08-12', category: 'Food' },
  { id: 't4', description: 'Apartment Rent', amount: 1600, type: 'expense', date: '2026-08-05', category: 'Rent' },
  { id: 't5', description: 'Netflix', amount: 15.99, type: 'expense', date: '2026-08-15', category: 'Entertainment' },
];

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=1', '--window-size=1440,1000',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=C:/Users/olaol/AppData/Local/Temp/fl-chrome-cdp',
  'about:blank',
], { stdio: 'ignore' });

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port: PORT, path }, (res) => {
      let d = '';
      res.on('data', (c) => (d += c));
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

// Wait for the debugging endpoint, then find the page target.
let wsUrl = null;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const targets = await getJSON('/json');
    const page = targets.find((t) => t.type === 'page');
    if (page) wsUrl = page.webSocketDebuggerUrl;
  } catch { /* not up yet */ }
  if (!wsUrl) await sleep(250);
}
if (!wsUrl) { console.error('FAIL: no CDP page target'); chrome.kill(); process.exit(1); }

const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let msgId = 0;
const pending = new Map();
let loadResolve = null;
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  if (m.method === 'Page.loadEventFired' && loadResolve) loadResolve();
};
const send = (method, params = {}) =>
  new Promise((res) => { const id = ++msgId; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
const waitLoad = () => new Promise((res) => { loadResolve = () => { loadResolve = null; res(); }; });
const evaluate = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(name, Buffer.from(data, 'base64'));
  console.log('wrote', name);
}

await send('Page.enable');
await send('Runtime.enable');

// First load, seed localStorage, reload into the seeded state.
let p = waitLoad(); await send('Page.navigate', { url: URL }); await p;
await evaluate(`localStorage.setItem('transactions', ${JSON.stringify(JSON.stringify(SEED))})`);
p = waitLoad(); await send('Page.reload'); await p;
await sleep(1500); // let React + Recharts paint
await shot('shot-populated-overview.png');

// Switch to the Transactions tab.
await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Transactions')?.click()`);
await sleep(700);
await shot('shot-transactions.png');

// Open the New-transaction modal.
await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'New transaction')?.click()`);
await sleep(600);
await shot('shot-modal.png');

// Report what the app actually computed, straight from the DOM.
const report = await evaluate(`JSON.stringify({
  title: document.querySelector('h1')?.textContent,
  rows: document.querySelectorAll('tbody tr').length,
  bodyText: document.body.innerText.replace(/\\n+/g,' | ').slice(0, 400)
})`);
console.log('DOM:', report.result?.value);

ws.close();
chrome.kill();
process.exit(0);
