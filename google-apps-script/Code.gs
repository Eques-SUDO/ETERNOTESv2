// Open your destination Google Sheet → Extensions → Apps Script, paste this
// file, and run setup() once before deploying it as a public web app.
const SHEET_NAME = 'Submissions'
const HEADERS = [
  'Submitted At',
  'Full Name',
  'Department',
  'Instrument / Vocal Role',
  'Experience Level',
  'Phone Number',
]
const DEPARTMENTS = [
  'Biology', 'Chemistry', 'Physics', 'Mathematics',
  'Computer Science', 'Geology', 'Other',
]
const ROLES = [
  'Vocals / Choir', 'Guitar (Acoustic)', 'Guitar (Electric)', 'Bass',
  'Piano / Keys', 'Violin / Strings', 'Drums / Percussion',
  'Production / Sound Engineering', 'Other',
]
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional']

// Run manually from the editor attached to the destination spreadsheet.
// Store its ID explicitly so web requests don't depend on an active editor.
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  if (!spreadsheet) {
    throw new Error('Open this script from your Google Sheet using Extensions → Apps Script.')
  }
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    prepareSheet(spreadsheet)
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId())
    console.log('Ready: ' + spreadsheet.getUrl())
  } finally {
    lock.releaseLock()
  }
}

// Visiting /exec checks that the deployment is reachable without revealing data.
function doGet() {
  return jsonResponse({ ok: true, service: 'ETERNOTES audition form' })
}

function doPost(e) {
  let submission
  try {
    const contents = e && e.postData && e.postData.contents
    if (!contents || contents.length > 10000) throw new Error('Invalid body')
    submission = JSON.parse(contents)
    if (!submission || typeof submission !== 'object' || Array.isArray(submission)) {
      throw new Error('Invalid submission')
    }
  } catch (error) {
    return jsonResponse({ ok: false, error: 'Invalid submission.' })
  }

  const fullName = cleanText(submission.fullName, 100)
  const department = cleanText(submission.department, 100)
  const otherDepartment = department === 'Other'
    ? cleanText(submission.otherDepartment, 100)
    : ''
  const role = cleanText(submission.role, 100)
  const experience = cleanText(submission.experience, 50)
  const phone = cleanText(submission.phone, 30)
  const phoneDigits = phone === null ? '' : phone.replace(/\D/g, '')

  if (
    fullName === null || fullName.length < 3 ||
    !DEPARTMENTS.includes(department) || !ROLES.includes(role) ||
    (department === 'Other' && !otherDepartment) ||
    !LEVELS.includes(experience) || phone === null ||
    !/^\+?[\d\s().-]+$/.test(phone) ||
    phoneDigits.length < 7 || phoneDigits.length > 15
  ) {
    return jsonResponse({ ok: false, error: 'Please check the form fields.' })
  }

  const lock = LockService.getScriptLock()
  try {
    lock.waitLock(10000)
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
    if (!spreadsheetId) throw new Error('Run setup() before accepting submissions.')
    const sheet = prepareSheet(SpreadsheetApp.openById(spreadsheetId))
    sheet.appendRow([
      new Date(),
      safeCell(fullName),
      safeCell(department === 'Other' ? otherDepartment : department),
      safeCell(role),
      safeCell(experience),
      // Store as text to preserve leading zeros and the international + prefix.
      "'" + phone,
    ])
    SpreadsheetApp.flush()
    return jsonResponse({ ok: true })
  } catch (error) {
    console.error(error)
    return jsonResponse({ ok: false, error: 'Could not save submission.' })
  } finally {
    if (lock.hasLock()) lock.releaseLock()
  }
}

function prepareSheet(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
    sheet.autoResizeColumns(1, HEADERS.length)
  } else {
    const headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0]
    if (!HEADERS.every((header, index) => headers[index] === header)) {
      throw new Error('The Submissions tab has unexpected columns. Rename it or restore the expected headers.')
    }
  }
  return sheet
}

// Reject invalid types and overlong fields instead of silently cutting them off.
function cleanText(value, maxLength) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length <= maxLength ? text : null
}

// Keep user-entered text from becoming a spreadsheet formula.
function safeCell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
