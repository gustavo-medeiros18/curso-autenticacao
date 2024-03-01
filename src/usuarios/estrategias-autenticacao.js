const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("./usuarios-modelo");
const { InvalidArgumentError } = require("../erros");
const bcrypt = require("bcrypt");

function verificaUsuario(usuario) {
  if (!usuario) throw new InvalidArgumentError("Não existe usuário com esse e-mail");
}

async function verificaSenha(senha, senhaHash) {
  const senhaValida = await bcrypt.compare(senha, senhaHash);

  if (!senhaValida) throw new InvalidArgumentError("E-mail ou senha inválidos");
}

// Configura o passport para usar a estratégia de autenticação local
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "senha", session: false },
    async (email, senha, done) => {
      const usuario = await Usuario.buscaPorEmail(email);

      try {
        verificaUsuario(usuario);
        await verificaSenha(senha, usuario.senhaHash);

        done(null, usuario);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(new BearerStrategy());
