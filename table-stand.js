// Standalone QR Code Engine & Desk Stand Controller
// Zero-dependency pure JavaScript QR Code generation (Byte mode, ECC M)

const GF_EXP = new Array(512);
const GF_LOG = new Array(256);

(function initGF() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_EXP[i + 255] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11D;
  }
  GF_LOG[0] = 0;
})();

function gfMul(x, y) {
  if (x === 0 || y === 0) return 0;
  return GF_EXP[GF_LOG[x] + GF_LOG[y]];
}

function rsGeneratorPoly(nsym) {
  let g = [1];
  for (let i = 0; i < nsym; i++) {
    const root = GF_EXP[i];
    const newG = new Array(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      newG[j] ^= gfMul(g[j], root);
      newG[j + 1] ^= g[j];
    }
    g = newG;
  }
  return g;
}

function rsEncode(msgIn, nsym) {
  const gen = rsGeneratorPoly(nsym);
  const msgOut = msgIn.concat(new Array(nsym).fill(0));
  for (let i = 0; i < msgIn.length; i++) {
    const coef = msgOut[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) {
        msgOut[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return msgOut.slice(msgIn.length);
}

const QR_SPECS_M = {
  1: [26, 10, 1, 16, 0, 0, []],
  2: [44, 16, 1, 28, 0, 0, [6, 18]],
  3: [70, 26, 1, 44, 0, 0, [6, 22]],
  4: [100, 36, 2, 32, 0, 0, [6, 26]],
  5: [134, 48, 2, 43, 0, 0, [6, 30]],
  6: [172, 64, 4, 27, 0, 0, [6, 34]]
};

function pickVersion(byteLen) {
  const neededBits = 4 + 8 + (byteLen * 8) + 4;
  const neededBytes = Math.ceil(neededBits / 8);
  for (let v = 1; v <= 6; v++) {
    const [total, ec, b1, d1, b2, d2] = QR_SPECS_M[v];
    const totalData = b1 * d1 + b2 * d2;
    if (neededBytes <= totalData) return v;
  }
  return 6;
}

function buildDataStream(dataStr, version) {
  const [total, ec, b1, d1, b2, d2] = QR_SPECS_M[version];
  const totalDataBytes = b1 * d1 + b2 * d2;
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(dataStr);

  let bitStream = "0100"; // Byte mode
  bitStream += dataBytes.length.toString(2).padStart(8, '0');
  for (let i = 0; i < dataBytes.length; i++) {
    bitStream += dataBytes[i].toString(2).padStart(8, '0');
  }

  const maxBits = totalDataBytes * 8;
  const termLen = Math.min(4, maxBits - bitStream.length);
  bitStream += "0".repeat(termLen);

  if (bitStream.length % 8 !== 0) {
    bitStream += "0".repeat(8 - (bitStream.length % 8));
  }

  const codewords = [];
  for (let i = 0; i < bitStream.length; i += 8) {
    codewords.push(parseInt(bitStream.substring(i, i + 8), 2));
  }

  const padBytes = [0xEC, 0x11];
  let padIdx = 0;
  while (codewords.length < totalDataBytes) {
    codewords.push(padBytes[padIdx % 2]);
    padIdx++;
  }

  return codewords;
}

function interleaveBlocks(dataBytes, version) {
  const [total, ec, b1, d1, b2, d2] = QR_SPECS_M[version];
  const ecPerBlock = ec / (b1 + b2);

  const dataBlocks = [];
  const ecBlocks = [];
  let offset = 0;
  for (let i = 0; i < b1; i++) {
    const blk = dataBytes.slice(offset, offset + d1);
    dataBlocks.push(blk);
    ecBlocks.push(rsEncode(blk, ecPerBlock));
    offset += d1;
  }
  for (let i = 0; i < b2; i++) {
    const blk = dataBytes.slice(offset, offset + d2);
    dataBlocks.push(blk);
    ecBlocks.push(rsEncode(blk, ecPerBlock));
    offset += d2;
  }

  const interleaved = [];
  const maxD = Math.max(...dataBlocks.map(b => b.length));
  for (let i = 0; i < maxD; i++) {
    for (const blk of dataBlocks) {
      if (i < blk.length) interleaved.push(blk[i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const blk of ecBlocks) {
      interleaved.push(blk[i]);
    }
  }
  return interleaved;
}

function createMatrix(version) {
  const size = version * 4 + 17;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(null));
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

  function setPattern(r0, c0, pat) {
    for (let r = 0; r < pat.length; r++) {
      for (let c = 0; c < pat[r].length; c++) {
        matrix[r0 + r][c0 + c] = pat[r][c];
        reserved[r0 + r][c0 + c] = true;
      }
    }
  }

  const finder = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1]
  ];

  setPattern(0, 0, finder);
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (r === 7 || c === 7) matrix[r][c] = 0;
      reserved[r][c] = true;
    }
  }

  setPattern(0, size - 7, finder);
  for (let r = 0; r < 8; r++) {
    for (let c = size - 8; c < size; c++) {
      if (r === 7 || c === size - 8) matrix[r][c] = 0;
      reserved[r][c] = true;
    }
  }

  setPattern(size - 7, 0, finder);
  for (let r = size - 8; r < size; r++) {
    for (let c = 0; c < 8; c++) {
      if (r === size - 8 || c === 7) matrix[r][c] = 0;
      reserved[r][c] = true;
    }
  }

  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0 ? 1 : 0;
    if (!reserved[6][i]) {
      matrix[6][i] = val;
      reserved[6][i] = true;
    }
    if (!reserved[i][6]) {
      matrix[i][6] = val;
      reserved[i][6] = true;
    }
  }

  const alignCoords = QR_SPECS_M[version][6];
  if (alignCoords && alignCoords.length > 0) {
    const alignPat = [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ];
    for (const ar of alignCoords) {
      for (const ac of alignCoords) {
        if ((ar < 9 && ac < 9) || (ar < 9 && ac > size - 9) || (ar > size - 9 && ac < 9)) continue;
        setPattern(ar - 2, ac - 2, alignPat);
      }
    }
  }

  matrix[4 * version + 9][8] = 1;
  reserved[4 * version + 9][8] = true;

  for (let c = 0; c < 9; c++) reserved[8][c] = true;
  for (let r = 0; r < 9; r++) reserved[r][8] = true;
  for (let c = size - 8; c < size; c++) reserved[8][c] = true;
  for (let r = size - 7; r < size; r++) reserved[r][8] = true;

  return { matrix, reserved, size };
}

function placeData(matrix, reserved, dataBytes) {
  const size = matrix.length;
  let bits = "";
  for (const b of dataBytes) {
    bits += b.toString(2).padStart(8, '0');
  }

  let bitIdx = 0;
  const bitLen = bits.length;
  let c = size - 1;
  let up = true;

  while (c > 0) {
    if (c === 6) c--;
    const cols = [c, c - 1];
    const rowRange = up
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rowRange) {
      for (const col of cols) {
        if (!reserved[r][col]) {
          if (bitIdx < bitLen) {
            matrix[r][col] = parseInt(bits[bitIdx], 10);
            bitIdx++;
          } else {
            matrix[r][col] = 0;
          }
        }
      }
    }
    up = !up;
    c -= 2;
  }
}

function getFormatBits(eccLevelBits, maskPattern) {
  const data = (eccLevelBits << 3) | maskPattern;
  let rem = data << 10;
  const g = 0b10100110111;
  for (let i = 14; i >= 10; i--) {
    if (rem & (1 << i)) {
      rem ^= (g << (i - 10));
    }
  }
  const fmt = ((data << 10) | rem) ^ 0b101010000010010;
  return fmt.toString(2).padStart(15, '0');
}

function applyMask(matrix, reserved, maskIdx) {
  const size = matrix.length;
  const out = matrix.map(row => [...row]);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (reserved[r][c]) continue;
      let flip = false;
      if (maskIdx === 0) flip = ((r + c) % 2 === 0);
      else if (maskIdx === 1) flip = (r % 2 === 0);
      else if (maskIdx === 2) flip = (c % 3 === 0);
      else if (maskIdx === 3) flip = ((r + c) % 3 === 0);
      if (flip) out[r][c] ^= 1;
    }
  }
  return out;
}

function placeFormatInfo(matrix, fmtBits) {
  const size = matrix.length;
  for (let i = 0; i < 6; i++) matrix[8][i] = parseInt(fmtBits[i], 10);
  matrix[8][7] = parseInt(fmtBits[6], 10);
  matrix[8][8] = parseInt(fmtBits[7], 10);
  matrix[7][8] = parseInt(fmtBits[8], 10);
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = parseInt(fmtBits[i], 10);

  for (let i = 0; i < 7; i++) matrix[size - 1 - i][8] = parseInt(fmtBits[i], 10);
  for (let i = 7; i < 15; i++) matrix[8][size - 15 + i] = parseInt(fmtBits[i], 10);
}

function generateQRCodeMatrix(text) {
  const v = pickVersion(new TextEncoder().encode(text).length);
  const rawData = buildDataStream(text, v);
  const interleaved = interleaveBlocks(rawData, v);
  const { matrix, reserved } = createMatrix(v);
  placeData(matrix, reserved, interleaved);

  const maskIdx = 0;
  const maskedMatrix = applyMask(matrix, reserved, maskIdx);
  const fmtBits = getFormatBits(0, maskIdx); // 0 = ECC M
  placeFormatInfo(maskedMatrix, fmtBits);

  return maskedMatrix;
}

function renderQRCodeSVG(matrix, moduleSize = 8, quietZone = 4, darkColor = "#111827", lightColor = "#ffffff") {
  const size = matrix.length;
  const totalModules = size + 2 * quietZone;
  const totalSize = totalModules * moduleSize;

  let pathD = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        const x = (c + quietZone) * moduleSize;
        const y = (r + quietZone) * moduleSize;
        pathD += `M${x},${y}h${moduleSize}v${moduleSize}h-${moduleSize}z `;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="100%" height="100%" shape-rendering="crispEdges">
      <rect width="100%" height="100%" fill="${lightColor}" rx="12" />
      <path d="${pathD}" fill="${darkColor}" />
    </svg>
  `;
}

// Controller Logic for Table Stand Page
document.addEventListener('DOMContentLoaded', () => {
  const menuUrlInput = document.getElementById('menuUrlInput');
  const reviewUrlInput = document.getElementById('reviewUrlInput');
  const tableNumInput = document.getElementById('tableNumInput');
  const layoutSelect = document.getElementById('layoutSelect');
  const themeSelect = document.getElementById('themeSelect');
  const printBtn = document.getElementById('printBtn');
  const standContainer = document.getElementById('standPreviewContainer');

  // Set default Menu URL to current window origin if available, or bobnbuns.netlify.app
  const defaultMenuUrl = (window.location.origin && !window.location.origin.includes('file://'))
    ? window.location.origin
    : 'https://bobnbuns.netlify.app';

  if (menuUrlInput && !menuUrlInput.value) {
    menuUrlInput.value = defaultMenuUrl;
  }

  function updateCards() {
    const menuUrl = menuUrlInput.value.trim() || 'https://bobnbuns.netlify.app';
    const reviewUrl = reviewUrlInput.value.trim() || 'https://share.google/Tr1mjQjTwQxDnojWD';
    const tableNum = tableNumInput.value.trim();
    const layout = layoutSelect.value;
    const theme = themeSelect.value;

    // Generate QR matrices
    const menuMatrix = generateQRCodeMatrix(menuUrl);
    const reviewMatrix = generateQRCodeMatrix(reviewUrl);

    const isDark = theme === 'dark';
    const qrDark = isDark ? '#ffffff' : '#111827';
    const qrLight = isDark ? '#1e2028' : '#ffffff';

    const menuSvg = renderQRCodeSVG(menuMatrix, 8, 4, qrDark, qrLight);
    const reviewSvg = renderQRCodeSVG(reviewMatrix, 8, 4, qrDark, qrLight);

    // Apply theme class
    standContainer.className = `stand-preview-wrapper theme-${theme} layout-${layout}`;

    const tableBadgeHtml = tableNum 
      ? `<div class="table-badge"><span>TABLE</span> <strong>${tableNum}</strong></div>` 
      : '';

    if (layout === 'tent') {
      // Foldable Triangle Table Tent (2 sides facing opposite directions)
      standContainer.innerHTML = `
        <div class="tent-card-page">
          <div class="tent-half tent-half-top">
            <div class="card-branding">
              <div class="brand-badge-mini">🍔</div>
              <div>
                <div class="card-brand-title">BOB 'N' BUNS</div>
                <div class="card-brand-sub">WHERE FLAVOR MEETS FUN • 100% PURE VEG</div>
              </div>
            </div>
            ${tableBadgeHtml}
            <div class="card-content-center">
              <div class="qr-holder-box">
                <div class="qr-svg-wrapper">${menuSvg}</div>
              </div>
              <div class="card-callout-pill menu-pill">
                <span>📱 SCAN FOR MENU</span>
              </div>
              <p class="card-instruction">Point camera to browse dishes, combos & download PDF</p>
              <div class="url-hint">${menuUrl}</div>
            </div>
            <div class="card-footer-mini">
              <span>📞 +91 9619242499 / +91 9619123404</span>
              <span>📍 Parvat Gam Road, Surat</span>
            </div>
          </div>

          <div class="tent-fold-divider">
            <div class="fold-line"></div>
            <span class="fold-label">✂️ FOLD HERE FOR TRIANGLE TABLE TENT ✂️</span>
            <div class="fold-line"></div>
          </div>

          <div class="tent-half tent-half-bottom">
            <div class="card-branding">
              <div class="brand-badge-mini">⭐</div>
              <div>
                <div class="card-brand-title">BOB 'N' BUNS</div>
                <div class="card-brand-sub">WHERE FLAVOR MEETS FUN • 100% PURE VEG</div>
              </div>
            </div>
            ${tableBadgeHtml}
            <div class="card-content-center">
              <div class="qr-holder-box">
                <div class="qr-svg-wrapper">${reviewSvg}</div>
              </div>
              <div class="card-callout-pill review-pill">
                <span>⭐ RATE US ON GOOGLE</span>
              </div>
              <div class="stars-gold">★★★★★</div>
              <p class="card-instruction">Loved your meal? Tap or scan to leave a review!</p>
              <div class="url-hint">share.google/Tr1mjQjTwQxDnojWD</div>
            </div>
            <div class="card-footer-mini">
              <span>Swiggy • Zomato</span>
              <span>Surat - 395012</span>
            </div>
          </div>
        </div>
      `;
    } else if (layout === 'acrylic') {
      // Side-by-Side Acrylic Desk Insert (Both QR codes on one card)
      standContainer.innerHTML = `
        <div class="acrylic-card">
          <div class="acrylic-card-header">
            <div class="card-branding">
              <div class="brand-badge-mini">🍔</div>
              <div>
                <div class="card-brand-title">BOB 'N' BUNS</div>
                <div class="card-brand-sub">WHERE FLAVOR MEETS FUN • 100% PURE VEG</div>
              </div>
            </div>
            ${tableBadgeHtml}
          </div>

          <div class="dual-qr-row">
            <!-- QR 1: Menu -->
            <div class="single-qr-panel">
              <div class="qr-holder-box">
                <div class="qr-svg-wrapper">${menuSvg}</div>
              </div>
              <div class="card-callout-pill menu-pill">
                <span>📱 SCAN FOR MENU</span>
              </div>
              <p class="card-instruction">View complete digital menu & PDF</p>
              <div class="url-hint">${menuUrl}</div>
            </div>

            <!-- Vertical Separator -->
            <div class="panel-divider"></div>

            <!-- QR 2: Review -->
            <div class="single-qr-panel">
              <div class="qr-holder-box">
                <div class="qr-svg-wrapper">${reviewSvg}</div>
              </div>
              <div class="card-callout-pill review-pill">
                <span>⭐ RATE ON GOOGLE</span>
              </div>
              <div class="stars-gold">★★★★★</div>
              <p class="card-instruction">Loved the food? Share a review!</p>
              <div class="url-hint">share.google/Tr1mjQjTwQxDnojWD</div>
            </div>
          </div>

          <div class="acrylic-footer">
            <div class="footer-contacts">
              <span>📞 +91 9619242499 / 💬 +91 9619123404</span>
              <span>📍 Shop No. 3, Block 80, Parvat Gam Road, Surat</span>
            </div>
            <div class="footer-badges">
              <span>Available on Swiggy & Zomato</span>
            </div>
          </div>
        </div>
      `;
    } else {
      // Separate Individual Cards (One Menu, One Review)
      standContainer.innerHTML = `
        <div class="separate-cards-container">
          <!-- Card 1: Menu -->
          <div class="individual-card">
            <div class="card-branding">
              <div class="brand-badge-mini">🍔</div>
              <div>
                <div class="card-brand-title">BOB 'N' BUNS</div>
                <div class="card-brand-sub">WHERE FLAVOR MEETS FUN • 100% PURE VEG</div>
              </div>
            </div>
            ${tableBadgeHtml}
            <div class="card-content-center">
              <div class="qr-holder-box">
                <div class="qr-svg-wrapper">${menuSvg}</div>
              </div>
              <div class="card-callout-pill menu-pill">
                <span>📱 SCAN FOR MENU</span>
              </div>
              <p class="card-instruction">Browse items, value meals, combos & download PDF</p>
              <div class="url-hint">${menuUrl}</div>
            </div>
            <div class="card-footer-mini">
              <span>📞 +91 9619242499 • WhatsApp: +91 9619123404</span>
            </div>
          </div>

          <!-- Card 2: Review -->
          <div class="individual-card">
            <div class="card-branding">
              <div class="brand-badge-mini">⭐</div>
              <div>
                <div class="card-brand-title">BOB 'N' BUNS</div>
                <div class="card-brand-sub">WHERE FLAVOR MEETS FUN • 100% PURE VEG</div>
              </div>
            </div>
            ${tableBadgeHtml}
            <div class="card-content-center">
              <div class="qr-holder-box">
                <div class="qr-svg-wrapper">${reviewSvg}</div>
              </div>
              <div class="card-callout-pill review-pill">
                <span>⭐ RATE US ON GOOGLE</span>
              </div>
              <div class="stars-gold">★★★★★</div>
              <p class="card-instruction">Your feedback helps us serve you better!</p>
              <div class="url-hint">share.google/Tr1mjQjTwQxDnojWD</div>
            </div>
            <div class="card-footer-mini">
              <span>📍 Parvat Gam Road, Behind Capital Squar, Surat</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Bind inputs
  menuUrlInput.addEventListener('input', updateCards);
  reviewUrlInput.addEventListener('input', updateCards);
  tableNumInput.addEventListener('input', updateCards);
  layoutSelect.addEventListener('change', updateCards);
  themeSelect.addEventListener('change', updateCards);

  // Print button
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Export SVGs
  const downloadMenuBtn = document.getElementById('downloadMenuSvgBtn');
  const downloadReviewBtn = document.getElementById('downloadReviewSvgBtn');

  function downloadSvg(text, filename) {
    const matrix = generateQRCodeMatrix(text);
    const svgContent = renderQRCodeSVG(matrix, 10, 4, '#111827', '#ffffff');
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (downloadMenuBtn) {
    downloadMenuBtn.addEventListener('click', () => {
      const url = menuUrlInput.value.trim() || 'https://bobnbuns.netlify.app';
      downloadSvg(url, 'bobnbuns-menu-qr.svg');
    });
  }

  if (downloadReviewBtn) {
    downloadReviewBtn.addEventListener('click', () => {
      const url = reviewUrlInput.value.trim() || 'https://share.google/Tr1mjQjTwQxDnojWD';
      downloadSvg(url, 'bobnbuns-google-review-qr.svg');
    });
  }

  // Initial render
  updateCards();
});

