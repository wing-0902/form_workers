import validator from 'validator';
import psl from 'psl';

function getDomain(email: string) {
  const i = email.lastIndexOf('@');
  if (i === -1) return null;
  return email.slice(i + 1);
}

export function emailValidation(emailAddress: string) {
  const syntaxValid = validator.isEmail(emailAddress);

  if (!syntaxValid) {
    console.log('メールシンタックスが無効');
    return false;
  }

  const emailDomain = getDomain(emailAddress);
  const domainValid = psl.isValid(emailDomain);

  if (!domainValid) {
    console.log('存在し得ないドメイン');
    return false;
  }

  console.log('メールアドレスの形式は有効');
  return true;
}
