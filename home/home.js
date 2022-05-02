export const home = () => {
  const homeContainer = document.createElement('div');
  const templateHome = `
  <article class="header-home">
  <section class="home-buttons nav">
    <a href="#login" class="button login">Entrar</a>
    <a href="#register" class="button">Cadastrar</a>
  </section>

  <section class="text-content">
    <p>
      Converse, <span>descubra</span> e <span>compartilhe</span> seus filmes
      e séries favoritos
    </p>
    <p class="text-participate">
      Crie sua conta para ter acesso a comunidade
    </p>
  </section>

  <div class="home-container">
    <a href="#register" class="button button-register">Participar</a>
  </div>

  <div class="container-image">
    <img
      src="img/img-home.svg"
      class="home-image"
      alt="Homem no sofá, com um balde de pipoca e óculos 3D."
    />
  </div>
</article>
    `;
  homeContainer.innerHTML = templateHome;
  console.log('olá');
  return homeContainer;
};
