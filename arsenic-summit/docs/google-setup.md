# Google setup for Arsenic Summit

## Recommended architecture

Use this split:

- Website: static HTML/CSS/JS
- Registrations: Google Forms
- Easy content management: Google Sheets
- Automation and email: Google Apps Script

This keeps the public website simple while letting your team update committees, agenda, and links without editing code.

## 1. Put registration on the website

1. Create one Google Form for individual delegates.
2. Create one Google Form for delegations.
3. Copy each form's public URL.
4. Open `admin.html` and paste those links into:
   - Individual form URL
   - Delegation form URL
5. Save preview to test locally, or export JSON for deployment.

The registration page will embed the forms automatically.

## 2. Send email automatically after form submission

Best option: use Google Apps Script attached to the response sheet or form.

### Requirements

- Turn on `Collect email addresses` in Google Forms.
- Make sure your form stores the submitter email in the response sheet.
- Add an installable `On form submit` trigger in Apps Script.

### Sample Apps Script

```javascript
function onFormSubmit(e) {
  const values = e.namedValues || {};
  const email = (values['Email Address'] || values['Email'] || [''])[0];
  const fullName = (values['Full Name'] || values['Name'] || ['Delegate'])[0];
  const committee = (values['Committee Preference'] || ['Your selected committee'])[0];

  const adminEmail = 'hello@arsenicsummit.org';

  MailApp.sendEmail({
    to: adminEmail,
    subject: 'New Arsenic Summit registration',
    htmlBody: `
      <p>A new registration was submitted.</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email || 'Not collected'}</p>
      <p><strong>Committee preference:</strong> ${committee}</p>
    `
  });

  if (email) {
    MailApp.sendEmail({
      to: email,
      subject: 'We received your Arsenic Summit registration',
      htmlBody: `
        <p>Hello ${fullName},</p>
        <p>We have received your registration for Arsenic Summit.</p>
        <p>Your submitted committee preference was: <strong>${committee}</strong>.</p>
        <p>Our team will contact you with review and allotment updates.</p>
      `
    });
  }
}
```

### Important

Change the field names in the script so they match your actual Google Form question titles exactly.

## 3. Manage committees and agenda without code

You have two good options.

### Option A: use `admin.html`

- Open `admin.html`
- Edit summit info, announcements, committees, and agenda
- Click `Download JSON`
- Deploy that JSON through your host or Apps Script

### Option B: use Google Sheets + Apps Script JSON endpoint

This is the best long term workflow.

- Store committees, agenda, and summit info in Google Sheets tabs
- Build a small Apps Script web app that returns JSON
- Paste that endpoint URL into `admin.html` under `Optional content API URL`
- The site can then read live content without HTML edits

## 4. Suggested Google Sheet tabs

- `settings`
- `announcements`
- `committees`
- `agenda`
- `faq`
- `forms`

## 5. Deployment note

Because this is a static website, automatic email sending should not happen in the website code itself.
That work should stay in Google Forms / Apps Script or a backend service.

## 6. Vercel admin protection

This project now uses:

- [middleware.js](../middleware.js) to protect `/admin.html` and `/docs/google-setup.md`
- [api/admin-login.js](../api/admin-login.js) to verify the password and create a secure session cookie
- [api/admin-logout.js](../api/admin-logout.js) to end that session
- [admin-access.html](../admin-access.html) as the quiet login screen linked near the site footer

### Set this environment variable in Vercel

- `ADMIN_ACCESS_PASSWORD`

Recommended current value:

- `ADMIN_ACCESS_PASSWORD=reoarsenic1901`

### How it behaves

- Visitors do not see an obvious admin button in the main top navigation.
- A smaller `Admin Access` link appears near the footer/end of the site.
- Opening that link shows a password form.
- If the password is wrong, the screen shows:
  `Don't be sneaky brat , Grandpa protects this site`
- If the password is correct, Vercel creates a secure server-side session cookie and opens `/admin.html`.

### Important local note

If you open HTML files directly on your computer, Vercel middleware and API routes do not run.
The secure login flow only works on the deployed Vercel site.
