/*
 @jest-environment jsdom
 */

import {
  userCreate, userLogin,
} from '../src/firebase/auth-firebase.js';
import { register } from '../src/register/register.js';
import { login } from '../src/login/login.js';

jest.mock('../src/firebase/auth-firebase.js');
jest.mock('../src/firebase/firebase.js');

describe('userCreate', () => {
  it('Deverá ser uma função', () => {
    expect(typeof userCreate).toBe('function');
  });
});

// eslint-disable-next-line jest/no-identical-title
describe('userCreate', () => {
  beforeEach(() => {
    userCreate.mockClear();
  });
  it('Deverá cadastrar corretamente o usuário', () => {
    userCreate.mockResolvedValueOnce();
    const email = 'teste@gmail.com';
    const password = '123456';
    const registerContainer = register();
    const emailInput = registerContainer.querySelector('.register-email');
    const passwordInput = registerContainer.querySelector('.register-password');
    const form = registerContainer.querySelector('#form-register');

    emailInput.value = email;
    passwordInput.value = password;
    form.submit();

    expect(userCreate).toHaveBeenCalledWith(email, password);
    expect(userCreate).toHaveBeenCalledTimes(1);
  });
  it('Deverá receber um erro se o Email for inválido', async () => {
    const erro = {
      code: 'auth/invalid-email',
    };
    userCreate.mockRejectedValueOnce(erro);
    const email = 'agora@vai';
    const password = '123456';
    const registerContainer = register();
    const emailInput = registerContainer.querySelector('.register-email');
    const passwordInput = registerContainer.querySelector('.register-password');
    const feedback = registerContainer.querySelector('.feedback');
    const form = registerContainer.querySelector('#form-register');

    emailInput.value = email;
    passwordInput.value = password;
    form.submit();
    await new Promise(process.nextTick);
    expect(userCreate).toHaveBeenCalledWith(email, password);
    expect(feedback.innerHTML).toEqual('Email inválido');
    expect(userCreate).toHaveBeenCalledTimes(1);
  });
  it('Deverá receber um erro se o Email já estiver em uso', async () => {
    const erro = {
      code: 'auth/email-already-exists',
    };
    userCreate.mockRejectedValueOnce(erro);
    const email = 'teste@teste.com';
    const password = '123456';
    const registerContainer = register();
    const emailInput = registerContainer.querySelector('.register-email');
    const passwordInput = registerContainer.querySelector('.register-password');
    const feedback = registerContainer.querySelector('.feedback');
    const form = registerContainer.querySelector('#form-register');

    emailInput.value = email;
    passwordInput.value = password;
    form.submit();
    await new Promise(process.nextTick);
    expect(userCreate).toHaveBeenCalledWith(email, password);
    expect(feedback.innerHTML).toEqual('Este email já esta em uso');
    expect(userCreate).toHaveBeenCalledTimes(1);
  });
  it('Deverá receber um erro se não conseguir realizar o cadastro', async () => {
    const erro = {
      code: 'auth/internal-error',
    };
    userCreate.mockRejectedValueOnce(erro);
    const email = 'teste@te';
    const password = '12';
    const registerContainer = register();
    const emailInput = registerContainer.querySelector('.register-email');
    const passwordInput = registerContainer.querySelector('.register-password');
    const feedback = registerContainer.querySelector('.feedback');
    const form = registerContainer.querySelector('#form-register');

    emailInput.value = email;
    passwordInput.value = password;
    form.submit();
    await new Promise(process.nextTick);
    expect(userCreate).toHaveBeenCalledWith(email, password);
    expect(feedback.innerHTML).toEqual('Não foi possível realizar seu cadastro');
    expect(userCreate).toHaveBeenCalledTimes(1);
  });

  describe('userLogin', () => {
    it('Deverá ser uma função', () => {
      expect(typeof userLogin).toBe('function');
    });
  });

  // eslint-disable-next-line jest/no-identical-title
  describe('userLogin', () => {
    it('Usuário deverá realizar o login', () => {
      userLogin.mockResolvedValueOnce();
      const email = 'teste@teste.com';
      const password = '123456';
      const loginContainer = login();
      const emailInput = loginContainer.querySelector('.login-email');
      const passwordInput = loginContainer.querySelector('.login-password');
      const form = loginContainer.querySelector('#form-login');

      emailInput.value = email;
      passwordInput.value = password;
      form.submit();

      expect(userLogin).toHaveBeenCalledWith(email, password);
      expect(userLogin).toHaveBeenCalledTimes(1);
    });
  });
});
it('Deverá receber um erro se a senha estiver incorreta', async () => {
  const erro = {
    code: 'auth/wrong-password',
  };
  userLogin.mockRejectedValueOnce(erro);
  const email = 'teste@teste.com';
  const password = '1234567';
  const loginContainer = login();
  const emailInput = loginContainer.querySelector('.login-email');
  const passwordInput = loginContainer.querySelector('.login-password');
  const feedback = loginContainer.querySelector('.feedback');
  const form = loginContainer.querySelector('#form-login');

  emailInput.value = email;
  passwordInput.value = password;
  form.submit();
  await new Promise(process.nextTick);
  expect(userLogin).toHaveBeenCalledWith(email, password);
  expect(feedback.innerHTML).toEqual('E-mail ou senha incorreta');
  expect(userLogin).toHaveBeenCalledTimes(2);
});
it('Deverá receber um erro se o E-mail for inválido', async () => {
  const erro = {
    code: 'auth/invalid-email',
  };
  userLogin.mockRejectedValueOnce(erro);
  const email = 'teste@test';
  const password = '123456';
  const loginContainer = login();
  const emailInput = loginContainer.querySelector('.login-email');
  const passwordInput = loginContainer.querySelector('.login-password');
  const feedback = loginContainer.querySelector('.feedback');
  const form = loginContainer.querySelector('#form-login');

  emailInput.value = email;
  passwordInput.value = password;
  form.submit();
  await new Promise(process.nextTick);
  expect(userLogin).toHaveBeenCalledWith(email, password);
  expect(feedback.innerHTML).toEqual('E-mail inválido');
  expect(userLogin).toHaveBeenCalledTimes(3);
});
it('Deverá receber um erro se o Usuário não for encontrado', async () => {
  const erro = {
    code: 'auth/user-not-found',
  };
  userLogin.mockRejectedValueOnce(erro);
  const email = 'teste@test.com';
  const password = '1234567';
  const loginContainer = login();
  const emailInput = loginContainer.querySelector('.login-email');
  const passwordInput = loginContainer.querySelector('.login-password');
  const feedback = loginContainer.querySelector('.feedback');
  const form = loginContainer.querySelector('#form-login');

  emailInput.value = email;
  passwordInput.value = password;
  form.submit();
  await new Promise(process.nextTick);
  expect(userLogin).toHaveBeenCalledWith(email, password);
  expect(feedback.innerHTML).toEqual('Usuário não encontrado');
  expect(userLogin).toHaveBeenCalledTimes(4);
});
it('Deverá receber um erro se não for possivel realizar o Login', async () => {
  const erro = {
    code: 'auth/internal-error',
  };
  userLogin.mockRejectedValueOnce(erro);
  const email = 'teste@test';
  const password = '12345';
  const loginContainer = login();
  const emailInput = loginContainer.querySelector('.login-email');
  const passwordInput = loginContainer.querySelector('.login-password');
  const feedback = loginContainer.querySelector('.feedback');
  const form = loginContainer.querySelector('#form-login');

  emailInput.value = email;
  passwordInput.value = password;
  form.submit();
  await new Promise(process.nextTick);
  expect(userLogin).toHaveBeenCalledWith(email, password);
  expect(feedback.innerHTML).toEqual('Opsss! Não foi possivel realizar o Login, tente novamente..');
  expect(userLogin).toHaveBeenCalledTimes(5);
});
