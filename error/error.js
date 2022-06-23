export const errors = (errorCode) => {
  switch (errorCode) {
    case 'auth/wrong-password':
      return 'E-mail ou senha incorreta';
    case 'auth/invalid-email':
      return 'E-mail inválido';
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    case 'auth/email-already-exists':
      return 'Este email já esta em uso';
    default:
      return 'Opsss! Algo deu errado! Tente novamente.';
  }
};
