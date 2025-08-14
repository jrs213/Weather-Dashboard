import { defineConfig } from 'unocss'

// Config options: https://unocss.dev/config/
export default defineConfig({
  theme: {
    colors: {
      primary: '#0b131f',
      secondary: '#202b3c',
      accent:  '#0c96f4',
      primaryDark: 'var(--color-primary-dark)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      text: 'var(--color-text)',
      textMuted: 'var(--color-text-muted)',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
    },
  },
})
