const bancoDeDados = require('../bancodedados');

const validarSenha = (req, res, next) => {
  const { banco_senha } = req.query
  
  if(bancoDeDados.banco.senha !== 'Cubos123Bank'){
    return res.status(401).json({mensagem: 'Senha incorreta.'})
  }
  next()
}

module.exports = {
  validarSenha
}