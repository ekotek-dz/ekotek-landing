# EKOTEK landing page

Static landing page in English, French and Algerian Arabic (Darija, right-to-left). No build step.

```
index.html              page content (text keys in data-i18n)
assets/i18n.js          all English, French and Darija text
assets/config.js        form endpoint, email, social links  <- edit here
assets/app.js           language switch, forms, share button
assets/style.css        styles
og-image.png            preview image for social media links
google-apps-script/     form receiver (Google Sheet + email), not deployed
```

## Language
Detected from the browser (French browsers get French, Arabic browsers get Darija). Force it with
`?lang=fr`, `?lang=en` or `?lang=ar` in the link, e.g. `?lang=ar` on Darija social posts.
Darija is written in Arabic script; choosing it switches the page to right-to-left.

## Forms -> Google Sheet + email
See `google-apps-script/Code.gs` (setup steps at the top). Paste the Web app URL into
`assets/config.js` -> `FORM_ENDPOINT`. Until then, forms open the visitor's email app instead.

## Deploy (Vercel)
Import this repository in Vercel -> Framework preset: **Other** -> no build command -> Deploy.
