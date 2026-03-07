import { createError, defineEventHandler, readBody } from 'h3';

import { emailValidation } from '#utils/validateEmail';

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    yourname: string;
    email?: string;
    message: string;
    'cf-turnstile-response'?: string;
  }>(event);

  if (!body.yourname || !body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form'
    });
  }

});
