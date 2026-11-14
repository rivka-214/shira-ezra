import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { POST as contactPost } from './api/contact.ts'

/**
 * Serves /api/contact from the dev server, so the contact forms work locally the same
 * way they do on Vercel (where api/contact.ts runs as a Vercel Function).
 */
function devContactApi(): Plugin {
  return {
    name: 'dev-contact-api',
    apply: 'serve',
    configureServer(server) {
      // Server-only secrets (no VITE_ prefix) from .env, for the handler only.
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const key of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }

      server.middlewares.use('/api/contact', async (req: IncomingMessage, res: ServerResponse) => {
        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)
        const request = new Request('http://localhost/api/contact', {
          method: req.method,
          headers: { 'Content-Type': String(req.headers['content-type'] ?? '') },
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        })
        const response =
          req.method === 'POST'
            ? await contactPost(request)
            : new Response('{"ok":false,"error":"method-not-allowed"}', { status: 405 })
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devContactApi()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
