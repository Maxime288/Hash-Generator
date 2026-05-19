'use strict';

// ─── MD5 Implementation ────────────────────────────────────────────────────
function md5(string) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }
  function str2binl(str) {
    const bin = [];
    const mask = (1 << 8) - 1;
    for (let i = 0; i < str.length * 8; i += 8) bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
    return bin;
  }
  function binl2hex(binarray) {
    const hex = '0123456789abcdef';
    let str = '';
    for (let i = 0; i < binarray.length * 4; i++)
      str += hex.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) + hex.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
    return str;
  }
  const str = unescape(encodeURIComponent(string));
  const x = str2binl(str);
  x[str.length >> 2] |= 0x80 << ((str.length % 4) * 8);
  x[(((str.length + 8) >> 6) + 1) * 16 + 14] = str.length * 8;
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    const S = [7,12,17,22, 5,9,14,20, 4,11,16,23, 6,10,15,21];
    const T = [-680876936,-389564586,606105819,-1044525330,-176418897,1200080426,-1473231341,-45705983,1770035416,-1958414417,-42063,-1990404162,1804603682,-40341101,-1502002290,1236535329,-165796510,-1069501632,643717713,-373897302,-701558691,38016083,-660478335,-405537848,568446438,-1019803690,-187363961,1163531501,-1444681467,-51403784,1735328473,-1926607734,-378558,-2022574463,1839030562,-35309556,-1530992060,1272893353,-155497632,-1094730640,681279174,-358537222,-722521979,76029189,-640364487,-421815835,530742520,-995338651,-198630844,1126891415,-1416354905,-57434055,1700485571,-1894986606,-1051523,-2054922799,1873313359,-30611744,-1560198380,1309151649,-145523070,-1120210379,718787259,-343485551];
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16)      { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (b & d) | (c & ~d); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else             { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const temp = d;
      d = c; c = b;
      b = safeAdd(b, bitRotateLeft(safeAdd(safeAdd(a, f), safeAdd(x[k + g] || 0, T[i])), S[Math.floor(i/16)*4 + i%4]));
      a = temp;
    }
    a = safeAdd(a, AA); b = safeAdd(b, BB); c = safeAdd(c, CC); d = safeAdd(d, DD);
  }
  return binl2hex([a, b, c, d]);
}

// ─── SHA via Web Crypto API ────────────────────────────────────────────────
async function sha(text, algo) {
  if (!text) return null;
  const encoded = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algo, encoded);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function computeHash(text, algo) {
  if (!text) return null;
  switch (algo) {
    case 'MD5':     return md5(text);
    case 'SHA-1':   return sha(text, 'SHA-1');
    case 'SHA-256': return sha(text, 'SHA-256');
    case 'SHA-512': return sha(text, 'SHA-512');
    default:        return null;
  }
}

// ─── Utils ─────────────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function byteLength(str) {
  return new TextEncoder().encode(str).length;
}

// ─── Tab system ────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  });
});

// ─── Generate tab ──────────────────────────────────────────────────────────
const inputText = document.getElementById('input-text');
const charCount = document.getElementById('char-count');
const byteCount = document.getElementById('byte-count');

const hashIds = [
  { id: 'hash-md5',    algo: 'MD5' },
  { id: 'hash-sha1',   algo: 'SHA-1' },
  { id: 'hash-sha256', algo: 'SHA-256' },
  { id: 'hash-sha512', algo: 'SHA-512' },
];

let debounceTimer;

inputText.addEventListener('input', () => {
  const text = inputText.value;
  const chars = text.length;
  const bytes = byteLength(text);
  charCount.textContent = chars + (chars !== 1 ? ' caractères' : ' caractère');
  byteCount.textContent = bytes + (bytes !== 1 ? ' octets' : ' octet');

  // Show placeholders immediately
  hashIds.forEach(({ id }) => {
    const el = document.getElementById(id);
    el.textContent = text ? '…' : '—';
    el.classList.remove('has-value');
  });

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => generateAll(text), 80);
});

async function generateAll(text) {
  await Promise.all(hashIds.map(async ({ id, algo }) => {
    const hash = await computeHash(text, algo);
    const el = document.getElementById(id);
    el.textContent = hash || '—';
    el.classList.toggle('has-value', !!hash);
  }));
}

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.dataset.target;
    const value = document.getElementById(targetId)?.textContent;
    if (!value || value === '—' || value === '…') return;
    try {
      await navigator.clipboard.writeText(value);
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Copié';
      btn.classList.add('copied');
      showToast('Hash copié dans le presse-papiers');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1500);
    } catch {
      showToast('Impossible d\'accéder au presse-papiers');
    }
  });
});

// Toolbar buttons
document.getElementById('btn-clear').addEventListener('click', () => {
  inputText.value = '';
  inputText.dispatchEvent(new Event('input'));
  inputText.focus();
});

document.getElementById('btn-paste').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    inputText.value = text;
    inputText.dispatchEvent(new Event('input'));
  } catch {
    showToast('Permission d\'accès au presse-papiers refusée');
  }
});

// ─── Compare tab ───────────────────────────────────────────────────────────
let selectedAlgo = 'MD5';

document.querySelectorAll('.algo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedAlgo = btn.dataset.algo;
    runCompare();
  });
});

const cmpText = document.getElementById('cmp-text');
const cmpHash = document.getElementById('cmp-hash');

cmpText.addEventListener('input', runCompare);
cmpHash.addEventListener('input', runCompare);

async function runCompare() {
  const text = cmpText.value;
  const inputHash = cmpHash.value.trim().toLowerCase();
  const resultEl = document.getElementById('compare-result');
  const computedEl = document.getElementById('computed-hash');
  const verdictEl = document.getElementById('verdict');

  if (!text || !inputHash) {
    resultEl.classList.add('hidden');
    return;
  }

  resultEl.classList.remove('hidden');
  computedEl.textContent = '…';
  verdictEl.textContent = '';

  const computed = await computeHash(text, selectedAlgo);
  computedEl.textContent = computed;

  const match = computed.toLowerCase() === inputHash;
  verdictEl.className = 'result-verdict ' + (match ? 'verdict-match' : 'verdict-mismatch');
  verdictEl.innerHTML = match
    ? '✓ Les hashs correspondent — le texte est authentique'
    : '✗ Les hashs sont différents — le texte a été modifié';
}
