import { defineNitroConfig } from 'nitropack/config';

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: '2026-03-07',
  preset: 'cloudflare_module',
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: {
      name: 'form-workers-for-applications',
      d1_databases: [
        {
          binding: 'FORM_DATABASE',
          database_name: 'wing_forms_database',
          database_id: 'b9fe5a8e-22ac-4974-b416-ad9c5a9abc9e'
        }
      ],
      routes: [
        {
          "pattern": "formapis.wave.graphics/formapis/*",
          "zone_name": "wave.graphics"
        }
      ]
    }
  },
  runtimeConfig: {
    lifeismoneyTurnstileToken: '',
    wingTurnstileSecret: ''
  },
  srcDir: 'server',
  imports: false,
  apiBaseURL: '/formapis',
  routeRules: {
    '/formapis/lifeis_money/**': {
      headers: {
        'Access-Control-Allow-Origin': 'https://lifeis.money',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    },
    '/formapis/wing_diary/**': {
      headers: {
        'Access-Control-Allow-Origin': 'https://diary.wing.osaka',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  }
});
