export const home = () => {
  const homeContainer = document.createElement('main');
  homeContainer.classList.add('home-container');

  homeContainer.innerHTML = `
    <article class="home">
      <section class="home-left">
        <div class="home-buttons">
          <a href="#login" class="button login">Entrar</a>
          <a href="#register" class="button">Cadastrar</a>
        </div>

        <section class="text-content">
          <p>
            Converse, descubra e compartilhe seus filmes
            e séries favoritos
          </p>
          <p class="text-participate">
            Crie sua conta para ter acesso à comunidade
          </p>
        </section>
      </section>

      <div class="home-right">
        <img
          src="img/img-home.svg"
          class="home-image"
          alt="Homem no sofá, com um balde de pipoca e óculos 3D."
        />
      </div>
    </article>
  `;

  return homeContainer;
};
