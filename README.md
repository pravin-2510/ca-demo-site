# CA & Associates Website Demo

A responsive, single-page Chartered Accountant website built with HTML, CSS, and vanilla JavaScript. It is designed to deploy directly to GitHub Pages with no build step or package installation.

## Preview locally

Open `index.html` in a browser. All page layout and interaction code is local; Tailwind CSS, AOS, Font Awesome, Inter, and the office photography load from their CDNs.

## Deploy to GitHub Pages

1. Push the contents of this folder to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the branch and `/ (root)`, then save.
4. Open the published Pages URL after the deployment finishes.

## Before publishing for a real firm

- Replace the demo phone number, email, service-area details, and LocalBusiness schema in `index.html`.
- Replace sample client names, testimonial copy, and editorial previews with approved, verifiable content.
- Create a free Web3Forms access key and set `CONFIG.WEB3FORMS_ACCESS_KEY` near the top of `script.js`. The browser submits directly to Web3Forms; the key is necessarily visible in a static site, so use the provider's domain restrictions and spam controls where available.
- Set `WHATSAPP_NUMBER` in `script.js` to the firm's international number using digits only. A successful enquiry opens WhatsApp; if the browser blocks the popup, the success toast includes a link.
- Optionally set `CONFIG.GA4_MEASUREMENT_ID` in `script.js`. GA4 is not loaded unless an ID is supplied.
- Update the social preview image and verify third-party image, font, and CDN availability.
- Tailwind's CDN build is convenient for this no-build demo; for production performance and a consistent Lighthouse score, use a compiled/minified Tailwind stylesheet. Performance scores depend on the chosen host, network, and third-party assets and cannot be guaranteed by the source alone.
- The newsletter form also submits through Web3Forms. Verify the provider's current free-tier quotas and data handling before collecting real enquiries.

## Files

- `index.html` — semantic page content, enquiry fields, SEO metadata, structured data, and CDN references.
- `styles.css` — responsive visual system, form states, WhatsApp and consultation controls, and reduced-motion support.
- `script.js` — Web3Forms AJAX submissions, validation, WhatsApp links, analytics hooks, navigation, carousel, counters, and AOS setup.
