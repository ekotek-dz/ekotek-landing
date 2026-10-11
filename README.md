# EKOTEK landing page

Static, bilingual (EN/FR) landing page. No build step.

```
index.html              page content (text keys in data-i18n)
assets/i18n.js          all English + French text
assets/config.js        form endpoint, email, social links  <- edit here
assets/app.js           language switch, forms, share button
assets/style.css        styles
og-image.png            preview image for social media links
google-apps-script/     form receiver (Google Sheet + email), not deployed
```

## Language
Detected from the browser (French browsers get French). Force it with `?lang=fr` or `?lang=en`
in the link, e.g. on French-speaking social posts.

## Forms -> Google Sheet + email
See `google-apps-script/Code.gs` (setup steps at the top). Paste the Web app URL into
`assets/config.js` -> `FORM_ENDPOINT`. Until then, forms open the visitor's email app instead.

## Deploy (Vercel)
Import this repository in Vercel -> Framework preset: **Other** -> no build command -> Deploy.
