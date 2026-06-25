import { useEffect, useMemo, useState } from 'react'
import {
  contentfulConfig,
  getDefaultEntries,
  isContentfulConfigured,
} from './lib/contentful'
import './App.css'

function getEntryTitle(entry) {
  const fields = entry.fields || {}
  return (
    fields.title ||
    fields.name ||
    fields.heading ||
    fields.slug ||
    entry.sys.id
  )
}

function formatFieldValue(value) {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatFieldValue(item))
      .filter(Boolean)
      .join(', ')
  }

  if (value.nodeType === 'document') {
    return 'Rich text content'
  }

  if (value.fields?.title || value.fields?.file?.url) {
    return value.fields.title || value.fields.file.url
  }

  return ''
}

function App() {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isContentfulConfigured) {
      return
    }

    let isMounted = true
    setStatus('loading')

    getDefaultEntries()
      .then((items) => {
        if (isMounted) {
          setEntries(items)
          setStatus('ready')
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message)
          setStatus('error')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const visibleConfig = useMemo(
    () => [
      ['Space', contentfulConfig.space],
      ['Environment', contentfulConfig.environment],
      ['Content type', contentfulConfig.contentType || 'All entries'],
    ],
    [],
  )

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">React + Contentful</p>
        <h1>Pattoo Castle content is ready to connect.</h1>
        <p className="lede">
          Add your Contentful keys, choose a content type if needed, and this
          starter will render the latest entries from your space.
        </p>
      </section>

      <section className="setup-panel" aria-labelledby="setup-title">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2 id="setup-title">Default Contentful setup</h2>
        </div>
        <dl className="config-list">
          {visibleConfig.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || 'Not set'}</dd>
            </div>
          ))}
        </dl>
      </section>

      {!isContentfulConfigured && (
        <section className="notice">
          <h2>Add your environment values</h2>
          <p>
            Create a local <code>.env.local</code> file from{' '}
            <code>.env.example</code>, fill in your Contentful space ID and
            Content Delivery API token, then restart the dev server.
          </p>
        </section>
      )}

      {isContentfulConfigured && (
        <section className="entries-section" aria-labelledby="entries-title">
          <div className="section-heading">
            <p className="eyebrow">Content preview</p>
            <h2 id="entries-title">Latest entries</h2>
          </div>

          {status === 'loading' && <p className="muted">Loading entries...</p>}

          {status === 'error' && (
            <p className="error">Contentful request failed: {error}</p>
          )}

          {status === 'ready' && entries.length === 0 && (
            <p className="muted">No entries matched the current query.</p>
          )}

          {entries.length > 0 && (
            <div className="entry-grid">
              {entries.map((entry) => {
                const fieldPreview = Object.entries(entry.fields || {})
                  .map(([name, value]) => [name, formatFieldValue(value)])
                  .filter(([, value]) => value)
                  .slice(0, 3)

                return (
                  <article className="entry-card" key={entry.sys.id}>
                    <p className="content-type">
                      {entry.sys.contentType?.sys.id || 'Entry'}
                    </p>
                    <h3>{getEntryTitle(entry)}</h3>
                    <dl>
                      {fieldPreview.map(([name, value]) => (
                        <div key={name}>
                          <dt>{name}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default App
