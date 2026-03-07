import { createError, defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';

import { emailValidation } from '#utils/validateEmail';
import type { TurnstileResponse } from '#utils/turnstileResponser';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const id = crypto.randomUUID();

  const body = await readBody<{
    yourname: string;
    email?: string;
    message: string;
    'cf-turnstile-response': string;
  }>(event);

  if (!body.yourname || !body.message || !body['cf-turnstile-response']) {
    console.error('不正なリクエスト形式');
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form syntax.'
    });
  } else {
    console.log('リクエスト形式は有効');
  }

  const turnstileToken = body['cf-turnstile-response'];

  if (body.email) {
    if (!emailValidation(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid form syntax.'
      });
    }
  }

  // Turnstileトークンを検証
  const turnstileResponse = await $fetch<TurnstileResponse>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: {
        secret: config.lifeismoneyTurnstileToken,
        response: turnstileToken,
        idempotency_key: id
      }
    }
  );

  if (!turnstileResponse.success) {
    console.error('Turnstile検証に失敗');
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    });
  } else {
    console.log('Turnstile検証は成功')
  }

  // やっとデータベースに保存
  const db = event.context.cloudflare.env.FORM_DATABASE;

  const created_at = Math.floor(Date.now() / 1000);

  await db
    .prepare(
      `INSERT INTO survey_responses (id, username, email, comment, hostname, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(id, body.yourname, body.email, body.message, 'lifeis.money', created_at)
    .run();

  return {
    success: true,
    id
  };
});
