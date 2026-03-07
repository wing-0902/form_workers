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
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form syntax.'
    });
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
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    });
  }

  // やっとデータベースに保存
  const db = event.context.cloudflare.env.FORM_DATABASE;

  await db
    .prepare(
      `INSERT INTO survey_responses (id, username, email, comment)
     VALUES (?, ?, ?, ?)`
    )
    .bind(id, body.yourname, body.email, body.message)
    .run();

  return {
    success: true,
    id
  };
});
