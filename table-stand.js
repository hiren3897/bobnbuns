// Rock-solid Table Stand Controller powered by standard QRCode engine
document.addEventListener('DOMContentLoaded', () => {
  const menuUrlInput = document.getElementById('menuUrlInput');
  const reviewUrlInput = document.getElementById('reviewUrlInput');
  const tableNumInput = document.getElementById('tableNumInput');
  const layoutSelect = document.getElementById('layoutSelect');
  const themeSelect = document.getElementById('themeSelect');
  const printBtn = document.getElementById('printBtn');
  const standContainer = document.getElementById('standPreviewContainer');

  // Set default Menu URL to current window origin if on live domain, or bobnbuns.netlify.app
  const defaultMenuUrl = (window.location.origin && !window.location.origin.includes('file://'))
    ? window.location.origin
    : 'https://bobnbuns.netlify.app';

  if (menuUrlInput && !menuUrlInput.value) {
    menuUrlInput.value = defaultMenuUrl;
  }

  // Generate QR code SVG using standard QRCode library
  async function generateSvg(text) {
    if (window.QRCode && typeof window.QRCode.toString === 'function') {
      try {
        return await window.QRCode.toString(text, {
          type: 'svg',
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
      } catch (err) {
        console.error('QRCode.toString error:', err);
      }
    }
    // Fallback to static SVG if library isn't loaded
    return `<img src="assets/menu-qr.svg" alt="QR Code" style="width: 100%; height: 100%;" />`;
  }

  async function updateCards() {
    const menuUrl = menuUrlInput.value.trim() || 'https://bobnbuns.netlify.app';
    const reviewUrl = reviewUrlInput.value.trim() || 'https://share.google/Tr1mjQjTwQxDnojWD';
    const tableNum = tableNumInput.value.trim();
    const layout = layoutSelect.value;
    const theme = themeSelect.value;

    const [menuSvg, reviewSvg] = await Promise.all([
      generateSvg(menuUrl),
      generateSvg(reviewUrl)
    ]);

    // Apply theme and layout classes
    standContainer.className = `stand-preview-wrapper theme-${theme} layout-${layout}`;

    const tableBadgeHtml = tableNum 
      ? `<div class="table-badge"><span>TABLE</span> <strong>${tableNum}</strong></div>` 
      : '';

    if (layout === 'tent') {
      // Foldable Triangle Table Tent (2 sides)
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
              <p class="card-instruction">Open camera to view digital menu, combos & download PDF</p>
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
              <p class="card-instruction">Loved your meal? Tap or scan to leave a quick review!</p>
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

  // Download SVG buttons
  const downloadMenuBtn = document.getElementById('downloadMenuSvgBtn');
  const downloadReviewBtn = document.getElementById('downloadReviewSvgBtn');

  async function triggerDownload(text, filename) {
    let svgContent = '';
    if (window.QRCode && typeof window.QRCode.toString === 'function') {
      svgContent = await window.QRCode.toString(text, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#000000', light: '#ffffff' }
      });
    }
    if (!svgContent) return;
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
      triggerDownload(url, 'bobnbuns-menu-qr.svg');
    });
  }

  if (downloadReviewBtn) {
    downloadReviewBtn.addEventListener('click', () => {
      const url = reviewUrlInput.value.trim() || 'https://share.google/Tr1mjQjTwQxDnojWD';
      triggerDownload(url, 'bobnbuns-google-review-qr.svg');
    });
  }

  // Initial render
  updateCards();
});
