const email = document.getElementById('auth_user_email');
const password = document.getElementById('auth_user_password');
const password_retype = document.getElementById('auth_user_password_retype');
const btnRegister = document.getElementById('btnRegister');
const captcha_input = document.getElementById('captcha_input');
const captcha_key = document.body.dataset.captcha;

setTimeout(() => {
  email.value.length > 0 ?
    password.focus() :
    email.focus();
}, 10);

email.addEventListener('change', () => check());
email.addEventListener('keyup', () => check());

password.addEventListener('change', () => check());
password.addEventListener('keyup', () => check());

password_retype.addEventListener('change', () => check());
password_retype.addEventListener('keyup', () => check());

function check() {
  btnRegister.disabled = !(
    email.validity.valid &&
    password.validity.valid &&
    password.value === password_retype.value &&
    captcha_input.validity.valid);
}

if (captcha_key) {

  grecaptcha.ready(() => {
    grecaptcha.execute(
      captcha_key, {action: 'login'}).then(
      token => {
  
        captcha_input.value = token;
        check();
    
      });
  });

} else {

  captcha_input.value = 'foo';
}