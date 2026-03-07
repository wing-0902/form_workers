import { defineNitroConfig } from 'nitropack/config';

// https://nitro.build/config
export default defineNitroConfig({
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
        'access-control-allow-methods': 'POST,OPTIONS'
      }
    },
    '/lifeis_money/**': {
      headers: {
        'access-control-allow-origin': 'https://lifels.money',
        'access-control-allow-methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  }
});
