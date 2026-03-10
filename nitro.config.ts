import { defineNitroConfig } from 'nitropack/config';

// https://nitro.build/config
export default defineNitroConfig({
  baseURL: '/api',
  compatibilityDate: '2026-03-07',
  preset: 'cloudflare_module',
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: {
      d1_databases: [
        {
          binding: 'FORM_DATABASE',
          database_name: 'wing_forms_database',
          database_id: 'b9fe5a8e-22ac-4974-b416-ad9c5a9abc9e'
        }
      ],
      routes: [
        {
          pattern: 'https://formapis.wave.graphics/api/*',
          name: 'form-workers-for-applications'
        }
      ]
    }
  },
  runtimeConfig: {
    lifeismoneyTurnstileToken: ''
  },
  srcDir: 'server',
  imports: false,
  routeRules: {
    '/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
      }
    },
    '/lifeis_money/**': {
      headers: {
        'Access-Control-Allow-Origin': 'https://lifeis.money',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  }
});
