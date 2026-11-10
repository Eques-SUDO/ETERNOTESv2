# Connect the audition form to Google Sheets

The website is wired to `VITE_GOOGLE_APPS_SCRIPT_URL`. Complete these steps
in your Google account to activate collection. No Google API key is needed.

## 1. Create the spreadsheet and install the script

1. Create a Google Sheet, for example **ETERNOTES Auditions**.
2. In that sheet, open **Extensions → Apps Script**.
3. Replace the default `Code.gs` with the complete contents of [Code.gs](./Code.gs) and save.
4. Select **setup** from the function dropdown and click **Run**.
5. Authorize the script to access your spreadsheet. If Google shows an unverified
   app notice, verify that this is the project you just created before continuing.
6. Return to the spreadsheet. You should see a **Submissions** tab with six columns:

   | Submitted At | Full Name | Department | Instrument / Vocal Role | Experience Level | Phone Number |
   | --- | --- | --- | --- | --- | --- |

`setup()` remembers this spreadsheet's ID in Script Properties. Keep the header
row intact. Existing submissions are preserved if you run setup again.

Selecting **Other** for the department reveals a required **Your Field of Study**
text field. The script saves that text in the existing **Department** column.

## 2. Deploy the web app

1. Choose **Deploy → New deployment**.
2. Click the deployment type gear and select **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**, so visitors can submit without signing in.
   If your organization disables public web apps, this approach requires an account
   whose administrator allows that access.
5. Click **Deploy**, authorize if asked, and copy the **Web app URL** ending in `/exec`.
   Use that URL rather than the editor URL or the `/dev` test URL.
6. Open the `/exec` URL in a private/incognito browser window. It should display:

   ```json
   {"ok":true,"service":"ETERNOTES audition form"}
   ```

This checks public deployment access; the form test below verifies spreadsheet writes.
Keep the Google Sheet private. Visitors receive permission to submit through the
script; they do not need access to the sheet.

## 3. Connect the website

In the project's `.env.local`, paste the URL after the equals sign:

```dotenv
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Restart `npm run dev` after editing this file. For a hosted website, set the same
environment variable in your hosting provider's build settings and rebuild/redeploy.
Vite embeds this value during the build; changing the variable after a build is not enough.
The URL is public configuration, so do not place private credentials in it.

## 4. Verify collection

1. Open the website and submit a test audition with a recognizable name.
2. Check that one new row appears in **Submissions**, including the timestamp and
   all five form fields. The phone number is required and stored as text to preserve
   leading zeros and international prefixes.
3. Repeat from a private/incognito window to verify that visitors can submit.
4. Remove the test rows manually when finished.

The browser sends JSON with a `text/plain` no-CORS POST to avoid a preflight request.
Its response is opaque: **Request sent** means the browser finished sending the
request, not that it verified the row was saved. Validate the deployment by checking
the sheet. Server validation/write errors are returned as JSON for API clients,
but the website cannot read them through this transport.

If a row is missing, check **Executions** in Apps Script, run `setup()` if needed,
and confirm public access and the `/exec` URL. If you change `Code.gs`, use
**Deploy → Manage deployments → Edit → Version: New version → Deploy** to update
the deployed code. A new deployment URL must also be updated in the website config.

Phone numbers accept 7–15 digits, with an optional leading `+`, spaces, parentheses,
dots, or hyphens. For example: `0612345678` or `+212 612 345 678`.

## Updating an existing portfolio-based spreadsheet

If your `Submissions` tab already has a **Social / Portfolio Link** column, rename
that tab to **Submissions Archive** before running `setup()` with the new script.
This preserves the old entries and creates a fresh `Submissions` tab with the
**Phone Number** column. Then deploy a new script version as described above.
If the old tab contains only headers and no entries, you can simply rename its
sixth header to **Phone Number** instead.

Official reference: [Google Apps Script web apps](https://developers.google.com/apps-script/guides/web).
