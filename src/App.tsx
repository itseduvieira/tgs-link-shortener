import { useState } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)

    try {
      const response = await fetch('https://api.tgs.lol/v1/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await response.json()
      setShortUrl(data.shortUrl)
    } catch (error) {
      console.error('Failed to shorten URL:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setUrl('')
    setShortUrl('')
    setCopied(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <h1 className="text-6xl sm:text-[72px] md:text-[96px] font-bold tracking-tight text-dark leading-[1.05] mb-4">
          Link Shortener
        </h1>

        {/* Form */}
        {!shortUrl ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              required
              className="w-full px-6 py-4 font-bold text-2xl rounded-xl border-4
                         border-dark focus:outline-none transition-colors
                         placeholder:text-muted/50"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 text-lg font-medium text-light bg-dark
                         rounded-xl hover:bg-dark/90 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-dark/5 rounded-xl">
              <p className="text-muted text-sm mb-2">Your shortened URL</p>
              <p className="font-bold text-2xl text-dark break-all">
                {shortUrl}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 px-6 py-4 text-lg font-medium text-light bg-dark
                           rounded-xl hover:bg-dark/90 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              
              <button
                onClick={handleReset}
                className="px-6 py-4 text-lg font-medium text-dark bg-dark/10 
                           rounded-xl hover:bg-dark/20 transition-colors"
              >
                New
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-muted text-sm">
        made by Edu 🐧
      </footer>
    </main>
  )
}

export default App