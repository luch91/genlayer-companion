export function downloadHTML(html: string, filename = 'genlayer-project.html'): void {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const NETLIFY_STEPS = [
  {
    step: 1,
    title: 'Download complete',
    description: 'Your HTML file is ready. Find it in your Downloads folder.',
  },
  {
    step: 2,
    title: 'Open Netlify Drop',
    description: 'Go to app.netlify.com/drop and drag your HTML file onto the page.',
    url: 'https://app.netlify.com/drop',
    cta: 'Open Netlify Drop',
  },
  {
    step: 3,
    title: 'Get your live URL',
    description: 'Netlify gives you a public URL instantly. Share it with the world.',
  },
]
