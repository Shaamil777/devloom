import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevLoom | The Modern Developer Platform',
    short_name: 'DevLoom',
    description: 'Discover the latest insights, tutorials, and discussions in the modern developer ecosystem.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
