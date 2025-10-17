# MEDAN Static Website

Modern, animated, and SEO-ready company profile website for MEDAN, distributor material uPVC (pintu & jendela uPVC).

## Features
- Responsive multi-page layout (Home, About, Products, Projects, Contact)
- Vanilla HTML5, CSS3, and JavaScript (no frameworks)
- Smooth scroll animations via AOS, hover interactions, and sticky navigation
- Product tabs, project filtering, lightbox gallery, and scroll-to-top button
- EmailJS integration ready for contact form submissions with Google reCAPTCHA v3
- SEO essentials: meta tags, Open Graph, sitemap, robots.txt, and schema markup

## Structure
```
.
├── index.html
├── about.html
├── products.html
├── projects.html
├── contact.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   └── *.svg (visual assets)
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## Usage
1. Replace placeholder URLs (https://www.example.com) with your production domain.
2. Update EmailJS public key, service ID, template ID, and Google Analytics / reCAPTCHA keys.
3. Optimize images if replacing the provided SVG placeholders.
4. Deploy the folder contents directly to your hosting (e.g., Hostinger `public_html`).

## Development Notes
- Tailwind/Bootstrap are not required; layout is handcrafted with custom CSS.
- Animations rely on lightweight libraries loaded via CDN.
- All images use `loading="lazy"` for better performance.
- Adjust colors or typography in `css/styles.css` as needed.
