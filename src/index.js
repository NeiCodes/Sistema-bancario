const express = require('express');
const { validarSenha } = require('./intermediarios/intermediario');
const router = require('./rotas/rotes');
const rotas = express();
const PORT = 3000;

rotas.use(validarSenha);
rotas.use(express.json());
rotas.use(router)


rotas.listen(PORT,() => {
  console.log(`Servidor funcionando na porta ${PORT}`);
})