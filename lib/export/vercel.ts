export const VERCEL_STEPS = [
  {
    step: 1,
    title: 'Save as index.html',
    description: 'Rename your downloaded file to index.html and place it in a new folder.',
  },
  {
    step: 2,
    title: 'Push to GitHub',
    description: 'Create a new GitHub repository and push your folder to it.',
    url: 'https://github.com/new',
    cta: 'New GitHub repo',
  },
  {
    step: 3,
    title: 'Import to Vercel',
    description: 'Connect your GitHub repository to Vercel for automatic deployments.',
    url: 'https://vercel.com/new',
    cta: 'Import on Vercel',
  },
  {
    step: 4,
    title: 'Configure build settings',
    description: 'Set Framework Preset to "Other" and leave build command blank. Output directory: . (root)',
  },
  {
    step: 5,
    title: 'Deploy',
    description: 'Click Deploy. Vercel will publish your site and give you a .vercel.app URL.',
  },
  {
    step: 6,
    title: 'Update CONTRACT_ADDRESS',
    description: 'After deploying your contract on Shipyard, add the address to your HTML file and redeploy.',
  },
]
