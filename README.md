# Chintamani Consultancy Website Demo

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
- Create an EmailJS service and email template, then set `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, and `EMAILJS_TEMPLATE_ID` near the top of `script.js`. The template should use `from_name`, `phone`, `from_email`, `reply_to`, `service`, `message`, `page_url`, and `submitted_at`.
- EmailJS public configuration is visible in a static site by design. Restrict allowed origins in EmailJS where available and apply account-level sending limits and spam controls.
- Set `WHATSAPP_NUMBER` in `script.js` to the firm's international number using digits only. A successful enquiry opens WhatsApp; if the browser blocks the popup, the success toast includes a link.
- Optionally set `CONFIG.GA4_MEASUREMENT_ID` in `script.js`. GA4 is not loaded unless an ID is supplied.
- Update the social preview image and verify third-party image, font, and CDN availability.
- Tailwind's CDN build is convenient for this no-build demo; for production performance and a consistent Lighthouse score, use a compiled/minified Tailwind stylesheet. Performance scores depend on the chosen host, network, and third-party assets and cannot be guaranteed by the source alone.
- Both the consultation enquiry and footer email signup use the same EmailJS configuration. Check EmailJS's current free-tier quotas and data handling before collecting real enquiries.

## Files

- `index.html` — semantic page content, enquiry fields, SEO metadata, structured data, and CDN references.
- `styles.css` — responsive visual system, form states, WhatsApp and consultation controls, and reduced-motion support.
- `script.js` — EmailJS submissions, validation, WhatsApp links, analytics hooks, navigation, carousel, counters, and AOS setup.
