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
- Connect the consultation and newsletter forms in `script.js` to a booking, email, or form service. The current forms show an on-page demo confirmation only and do not send or store submissions.
- Update the social preview image and verify third-party image, font, and CDN availability.
- Tailwind's CDN build is convenient for this no-build demo; for production performance and a consistent Lighthouse score, use a compiled/minified Tailwind stylesheet. Performance scores depend on the chosen host, network, and third-party assets and cannot be guaranteed by the source alone.

## Files

- `index.html` — semantic page content, SEO and social metadata, structured data, and CDN references.
- `styles.css` — responsive visual system, layout, motion, and reduced-motion support.
- `script.js` — mobile navigation, consultation modal, testimonial carousel, counters, and demo form feedback.
