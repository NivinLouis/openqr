# OpenQR

**OpenQR** is a completely free, privacy-first, tracking-free QR code generator. The primary purpose of this project is to provide a clean, accessible tool for anyone to generate highly aesthetic QR codes that point *directly* to their destinations without the use of intermediary redirects, link trackers, or URL shorteners.

Many modern QR code generators falsely advertise as "free," only to insert URL shorteners, display ads, force users to register, or cause the QR code to expire after a certain volume of scans. OpenQR is built to combat exactly that.

## 🌟 Our Purpose

We believe that data encoding should not come at the cost of your privacy or the integrity of your links. OpenQR guarantees:
- **Zero Redirects**: The QR code encodes exactly the data you provide. We do not reroute traffic.
- **Zero Tracking**: We do not inject analytics into your QR links.
- **Zero Lock-in**: Your QR codes will never expire. Since they point directly to your URL, they will work forever.
- **100% Free**: No freemium model. Unlimited high-resolution scans and downloads. No watermark.

## ✨ Features

- **Direct Data Formats**: Supports URLs, raw text, Email configurations, Phone numbers, and WiFi setups.
- **Extensive UI Customization**: Take full control of the look and feel. Adjust the corner radius, dot types, background color, and frame styles.
- **Image Insertion**: Embed your own custom logos right in the center of the QR.
- **Multiple Export Formats**: Download as polished PNG, responsive SVG, or JPG assets.
- **Save Configurations**: Export and import your QR style settings locally as JSON files inside your working environment so you can reliably match styles without cloud-saving.
- **Built-in Scanner**: Scan existing codes seamlessly using an image upload or straight through your device's camera.
- **Glassmorphic Vibe**: A stunning custom-designed interface.

## 🚀 Getting Started

First, ensure you have Node.js installed, then clone the repository and run the development server:

```bash
# Clone the repository
git clone https://github.com/NivinLouis/openqr.git
cd openqr

# Install dependencies
npm install

# Run the local environment
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contribution

Feel free to open an issue or submit a pull request if you want to add new formatting options, export setups, or generally improve the utility. Because OpenQR is inherently open-source, your contributions will actively preserve this free alternative for everyone.
