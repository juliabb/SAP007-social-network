export const login = () => {
  const loginCreate = document.createElement('div');
  const templateLogin = `
    <main class="home-container">
    <form id="loginForm" class="loginForm">
      <h2 class="subtitle">Login</h2>
      <input
        class="inputNames"
        type="text"
        id="loginEmail"
        placeholder="Digite seu e-mail" autocomplet
        required
      />
      <input
        class="inputNames"
        type="password"
        id="loginPassword"
        placeholder="Digite uma senha"
        required
      />
      <div class="button-container loginEnter">
      <button id="loginEnter" class="button" type="submit" role="link">
        Entrar
      </button>
      </div>
      <div class="text-content">
      <p class="textForgot">
      Esqueci a <a class="links" href="">Senha</a>
      </p>
      <div class="social-media">
      <p>Ou entrar com o Google</p>
      <button class="buttonGoogle" type="button" id="buttonGoogle">
      <img class="buttonGoogleImg" src="img/icone-google.png" alt="Imagen logo de Google" />
      </button>
      </div>
      </div>
    </form>
    <div class="social-media">
    <p class="textRegister" >Ainda não tem conta? 
    <a href="#register" class="links">Cadastre-se</a>
    </p>
    </div>
    <div class="backContainer">
    <a href="#home" class="backHome">Voltar a tela inicial</a>
    </div>
  </main>
  `;

  loginCreate.innerHTML = templateLogin;
  return loginCreate;
};