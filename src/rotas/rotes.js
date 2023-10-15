const express = require('express');
const { listarContas, criarConta, atualizarUsuario, excluirConta, deposito, saque, transferencia, saldo, extrato } = require('../controladores/contas');
const router = express.Router();

router.get('/contas', listarContas );
router.post('/contas', criarConta);
router.put('/contas/:numeroConta/usuario', atualizarUsuario);
router.delete('/contas/:numeroConta', excluirConta);
router.post('/transacoes/depositar', deposito);
router.post('transacoes/sacar', saque);
router.post('transacoes/transferir', transferencia);
router.get('/contas/saldo:numero_conta', saldo);
router.get('/contas/extrato/:numerco_conta', extrato);

module.exports = router;
