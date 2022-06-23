export const home = () => {
  const homeContainer = document.createElement('div');
  const templateHome = `
  <article class='header-home'>
  <section class='home-buttons nav'>
    <a href='#login' class='button login'>Entrar</a>
    <a href='#register' class='button'>Cadastrar</a>
  </section>

  <section class='text-content'>
    <p>
      Converse, descubra e compartilhe seus filmes
      e séries favoritos
    </p>
    <p class='text-participate'>
      Crie sua conta para ter acesso a comunidade
    </p>
  </section>

  <div class="container-image">
    <img
      src='img/img-home.svg'
      class='home-image'
      alt='Homem no sofá, com um balde de pipoca e óculos 3D.'
    />
    </div>
</article>
    `;
  homeContainer.innerHTML = templateHome;
  return homeContainer;
};
