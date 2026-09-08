# Bob 'N' Buns Surat — Digital Menu & Dual QR Table Stand System

Official web portal, interactive digital menu, PDF menu host, and printable dual-QR table stand generator for **Bob 'N' Buns** (Surat, Gujarat).

---

## 🚀 Features

- **📱 Interactive Digital Menu**:
  - 100% Pure Veg burger house menu with all items, descriptions, and official prices.
  - Value Meals & Combos, Burgers, Wraps, French Fries (Medium & Large), Pizzas, Dips & Add-ons.
  - Live real-time search & instant category filtering.
  - One-tap WhatsApp ordering with pre-filled items (`+91 9619123404`).
  - Swiggy & Zomato integration.

- **📄 Hosted PDF Menu**:
  - Official 2-page PDF menu accessible at `/bobnbuns-menu.pdf` (aliased at `/menu` and `/pdf`).
  - Embedded viewer on the website and direct download button.

- **🖨️ Dual QR Desk / Table Stand Generator (`/table-stand.html` or `/table`)**:
  - Generates print-ready table stands with **TWO QR CODES**:
    1. **QR 1: Menu**: Scannable link to digital menu & PDF.
    2. **QR 2: Google Review**: Scannable link to Google Business profile (`https://share.google/Tr1mjQjTwQxDnojWD` or `/review`).
  - **3 Print Formats**:
    - **Foldable Triangle Tent** (print on standard paper, fold down the center line for standing on tables).
    - **Acrylic Stand Insert** (4x6" / A6 / 5x7" insert with both QR codes side-by-side).
    - **Separate Individual Cards** (one card for Menu, one for Google Reviews).
  - **Themes**: Bob 'N' Buns Dark Theme & Crisp White Ink-Saver Theme.
  - **Interactive Controls**: Update target URLs, set table numbers, or download raw SVG vector QR codes.

- **⚡ Netlify-Ready**:
  - Zero build step required — static files deploy in seconds.
  - Smart redirects configured (`/review` -> Google Maps reviews, `/menu` -> PDF menu).

---

## 📂 Project Structure

```text
bobnbuns/
├── index.html              # Main web portal and digital menu
├── style.css               # Main responsive stylesheet
├── app.js                  # Menu rendering, search & category logic
├── table-stand.html        # Interactive table stand & desk QR printer
├── table-stand.css         # Desk stand layouts & @media print styles
├── table-stand.js          # In-browser pure JS vector QR code generator
├── bobnbuns-menu.pdf       # Official high-resolution PDF menu (3.6 MB)
├── netlify.toml            # Netlify configuration, redirects & headers
├── _redirects              # Flat redirect rules for Netlify
├── assets/
│   ├── menu-data.js        # Full menu item catalog & prices
│   ├── menu.pdf            # Backup copy of PDF
│   ├── menu-qr.svg         # Pre-rendered vector QR code for Menu
│   └── review-qr.svg       # Pre-rendered vector QR code for Google Review
├── qr/
│   ├── menu-qr.svg
│   └── review-qr.svg
└── scripts/
    └── generate_qr.py      # Standalone pure Python QR code generator
```

---

## 🛠️ Testing Locally

You can test the site locally using any static web server:

```bash
# Using Python 3 built-in server:
python3 -m http.server 8080

# Then open in your browser:
# Main Menu:        http://localhost:8080
# Desk QR Stand:    http://localhost:8080/table-stand.html
```

---

## 🌐 Deploying to Netlify (3 Easy Methods)

### Method 1: Netlify Drag & Drop (Fastest — 30 seconds, No CLI needed)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Log in to your Netlify account.
3. Drag and drop this entire `bobnbuns` folder onto the page.
4. Your site is instantly live! You can set your site name to `bobnbuns.netlify.app` in Site Settings.

### Method 2: Git & Netlify (Continuous Deployment)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial Bob 'N' Buns website and QR table stands"
   gh repo create bobnbuns --public --source=. --push
   ```
2. Log in to [https://app.netlify.com](https://app.netlify.com).
3. Click **Add new site** > **Import an existing project** > **GitHub**.
4. Select the `bobnbuns` repository.
5. Keep Build settings empty and Publish directory as `.` (root).
6. Click **Deploy bobnbuns**.

### Method 3: Netlify CLI
```bash
# If netlify-cli is installed:
npx netlify deploy --prod --dir=.
```

---

## 🖨️ How to Print Table Stands for Restaurant Desks

1. Open `table-stand.html` in your browser (or visit `https://<your-site>.netlify.app/table-stand.html`).
2. Verify that the **Menu Target URL** matches your live Netlify domain (e.g., `https://bobnbuns.netlify.app`).
3. Select your preferred layout:
   - **Foldable Triangle Tent** (recommended for freestanding tables).
   - **Acrylic Stand Insert** (recommended if you have 4x6" clear acrylic table holders).
4. Choose **Bob 'N' Buns Dark** for vibrant color prints or **Crisp White (Ink-Saver)** for standard black & white printing.
5. Click **Print Desk Card** (or press `Ctrl+P` / `Cmd+P`).
6. In the print dialog:
   - Destination: Your printer or **Save as PDF**.
   - Margins: **None** or **Default**.
   - Options: Check **Background graphics** so colors & borders print.
7. Print, fold or insert into acrylic stands, and place on restaurant tables!

