import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { parse } from '@babel/parser'
import { french, translate } from '../src/i18n/translations.js'

// Catch missing translations before they silently fall back to English.
const files = ['src/App.jsx', 'src/i18n/LanguageContext.jsx', ...fs.readdirSync('src/components')
  .filter((name) => name.endsWith('.jsx')).map((name) => `src/components/${name}`)]
function visit(node, callback) {
  if (!node || typeof node !== 'object') return
  if (node.type) callback(node)
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'extra'].includes(key)) continue
    if (Array.isArray(value)) value.forEach((child) => visit(child, callback))
    else if (value && typeof value === 'object') visit(value, callback)
  }
}
for (const file of files) {
  visit(parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] }), (node) => {
    if (node.type === 'ObjectProperty' &&
      ['title', 'label', 'role', 'dept', 'craft', 'tagline', 'text', 'tag', 'date', 'place', 'entry'].includes(node.key.name) &&
      node.value.type === 'StringLiteral' && node.value.value && !['Instagram', 'YouTube', 'LinkedIn', 'Discord'].includes(node.value.value)) {
      assert.ok(french[node.value.value], `Missing card/option translation: ${node.value.value}`)
    }
    if (node.type === 'VariableDeclarator' && ['WORDS', 'DEPARTMENTS', 'ROLES', 'LEVELS'].includes(node.id.name)) {
      for (const item of node.init.elements) assert.ok(french[item.value], `Missing option translation: ${item.value}`)
    }
    if (node.type === 'CallExpression'  && node.callee.name === 't' && node.arguments[0]?.type === 'StringLiteral') {
      assert.ok(french[node.arguments[0].value.trim()], `Missing French translation in ${file}: ${node.arguments[0].value}`)
    }
  })
}
assert.equal(translate('fr', 'Thanks, '), 'Merci, ')
assert.equal(translate('en', 'Other'), 'Other')
assert.equal(translate('fr', 'Portrait of {name}', { name: 'Salma' }), 'Portrait de Salma')

// Validate the real form logic and ensure its messages translate as well.
const formSource = fs.readFileSync('src/components/JoinForm.jsx', 'utf8')
const validationNode = parse(formSource, { sourceType: 'module', plugins: ['jsx'] }).program.body
  .find((node) => node.type === 'FunctionDeclaration' && node.id.name === 'validate')
const validate = vm.runInNewContext(`(${formSource.slice(validationNode.start, validationNode.end)})`)
const valid = { fullName: 'Test Student', department: 'Physics', otherDepartment: '', role: 'Piano / Keys', experience: 'Beginner', phone: '0612345678' }
assert.equal(Object.keys(validate(valid)).length, 0)
assert.ok(validate({ ...valid, department: 'Other' }).otherDepartment)
assert.equal(Object.keys(validate({ ...valid, department: 'Other', otherDepartment: 'Médecine' })).length, 0)
for (const error of Object.values(validate({ fullName: '', department: '', otherDepartment: '', role: '', experience: '', phone: '' }))) {
  assert.ok(french[error], `Missing validation translation: ${error}`)
}
assert.ok(french[validate({ ...valid, department: 'Other' }).otherDepartment])

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const originalError = console.error
console.error = (...args) => {
  if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return
  originalError(...args)
}
try {
  const { LanguageContext, LanguageProvider } = await server.ssrLoadModule('/src/i18n/LanguageContext.jsx')
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  for (const language of ['en', 'fr']) {
    const markup = renderToString(React.createElement(LanguageContext.Provider, {
      value: { language, setLanguage() {}, t: (key, params) => translate(language, key, params) },
    }, React.createElement(App)))
    assert.ok(markup.includes('aria-label="English"'))
    assert.ok(markup.includes('aria-label="Français"'))
    assert.ok(markup.includes(language === 'fr' ? 'Nom et prénom' : 'Full Name'))
    assert.ok(markup.includes(language === 'fr' ? 'Numéro de téléphone' : 'Phone Number'))
    assert.ok(markup.includes(language === 'fr' ? 'À déterminer' : 'To be determined'))
    assert.ok(markup.includes(language === 'fr' ? 'Annonce à venir' : 'To be announced'))
    assert.ok(!markup.includes('Winter Harmony Night'))
    assert.ok(!markup.includes('Dec 18, 2026'))
    // The display translates while submitted values stay compatible with Apps Script.
    assert.match(markup, language === 'fr' ? /value="Physics">Physique<\/option>/ : /value="Physics">Physics<\/option>/)
    assert.match(markup, language === 'fr' ? /value="Other">Autre<\/option>/ : /value="Other">Other<\/option>/)
    assert.ok(markup.includes(language === 'fr' ? 'Ingénierie du son' : 'Sound Engineering'))
    fs.writeFileSync(`/private/tmp/eternotes-${language}-render.html`, markup)
  }
  // Restore a saved preference, and keep the English default if storage is blocked.
  globalThis.window = { localStorage: { getItem: () => 'fr' } }
  assert.ok(renderToString(React.createElement(LanguageProvider, null, React.createElement(App))).includes('Nom et prénom'))
  globalThis.window = { localStorage: { getItem() { throw new Error('Storage blocked') } } }
  assert.ok(renderToString(React.createElement(LanguageProvider, null, React.createElement(App))).includes('Full Name'))
  delete globalThis.window
  console.log('PASS: translation coverage, both page renders, accessible language switch, activity placeholders, canonical form values, saved language and blocked-storage fallback')
} finally {
  console.error = originalError
  delete globalThis.window
  await server.close()
}
