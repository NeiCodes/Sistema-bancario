const bancoDeDados = require('../bancodedados');

const validarDados = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
  }
}

const listarContas = (req, res) => {

  if (bancoDeDados.contas <= 0) {
    return res.json({ mensagem: 'Nenhuma conta encotrnada' })
  }
  return res.json(bancoDeDados.contas);
}

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  validarDados;

  const novaConta = {
    numero: (bancoDeDados.contas.length + 1).toString(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  const contaExistente = bancoDeDados.contas.find(
    (conta) => {
      return conta.usuario.cpf === novaConta.usuario.cpf || conta.usuario.email === novaConta.usuario.email
    });

  if (contaExistente) {
    return res.status(400).json({ mensagem: 'Já existe uma conta com o CPF ou e-mail fornecido.' });
  }

  bancoDeDados.contas.push(novaConta);

  res.status(201).json({ mensagem: 'Conta criada com sucesso!' });
};

const atualizarUsuario = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;
  const selecionarUsuario = bancoDeDados.contas.find((conta) => conta.numero === Number(numeroConta))

  if (!selecionarUsuario) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  const contaComMesmoCPF = bancoDeDados.contas.find((conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta);

  const contaComMesmoEmail = bancoDeDados.contas.find((conta) => conta.usuario.email === email && conta.numero !== numeroConta
  );

  if (contaComMesmoCPF || contaComMesmoEmail) {
    res.json({ mensagem: 'O CPF ou e-mail informado já existe cadastrado' })
  }

  selecionarUsuario.usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  }

  return res.status(204);
}

const excluirConta = (req, res) => {
  const { numeroConta } = req.params;

  const contaExcluida = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);


  if (!contaExcluida) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  if (contaExcluida.saldo !== 0) {
    return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
  }

  bancoDeDados.contas = bancoDeDados.contas.filter((conta) => conta.numero !== numeroConta);

  return res.status(204).send();
}

const deposito = (req, res) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta || valor === undefined || valor <= 0) {
    return res.status(400).json({ mensagem: 'O número da conta e o valor são obrigatórios e devem ser maiores que zero!' });
  }
  const confirmarConta = bancoDeDados.contas.find((conta) => {
    return conta.numero === numero_conta;
  });

  if (!confirmarConta) {
    res.status(404).json({ mensagem: 'Conta não encontrada' })
  }

  const data = new Date().toLocaleString();
  const valorDeposito = parseFloat(valor);
  conta.saldo += valorDeposito;

  const transacao = {
    data,
    numero_conta,
    valor: valorDeposito,
  };

  bancoDeDados.depositos.push(transacao);

  return res.status(204).send();

}

const saque = (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  if (!numero_conta || valor === undefined || valor <= 0 || !senha) {
    return res.status(400).json({ mensagem: 'Número da conta, valor do saque e senha são obrigatórios e o valor deve ser maior que zero!' });
  }

  const confirmarConta = bancoDeDados.contas.find((conta) => {
    return conta.numero === numero_conta;
  });

  if (!confirmarConta) {
    return res.status(404).json({ mensagem: 'Conta não encontrada!' });

  }

  if (senha !== confirmarConta.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }

  if (confirmarConta.saldo < valor) {
    return res.status(403).json({ mensagem: 'Saldo insuficiente para realizar o saque!' });
  }

  const data = new Date().toLocaleString();
  const valorSaque = parseFloat(valor);
  conta.saldo -= valorSaque;

  const transacao = {
    data,
    numero_conta,
    valor: valorSaque,
  };

  bancoDeDados.saques.push(transacao);

  return res.status(204).send();

}

const transferencia = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem || !numero_conta_destino || valor === undefined || valor <= 0 || !senha) {
    return res.status(400).json({ mensagem: 'Número da conta de origem, número da conta de destino, valor da transferência e senha são obrigatórios e o valor deve ser maior que zero!' });
  }

  const contaOrigem = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_origem);

  const contaDestino = bancoDeDados.contas.find((conta) => conta.numero === numero_conta_destino);

  if (!contaOrigem || !contaDestino) {
    return res.status(404).json({ mensagem: 'Conta de origem ou conta de destino não encontrada!' });
  }

  if (senha !== contaOrigem.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }

  if (contaOrigem.saldo < valor) {
    return res.status(403).json({ mensagem: 'Saldo insuficiente para realizar a transferência!' });
  }

  const data = new Date().toLocaleString();
  const valorTransferencia = parseFloat(valor);
  contaOrigem.saldo -= valorTransferencia;
  contaDestino.saldo += valorTransferencia;

  const transacao = {
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor: valorTransferencia,
  };

  bancoDeDados.transferencias.push(transacao);

  return res.status(204).send();
}

const saldo = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios!' });
  }

  const conta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }

  return res.status(200).json({ saldo: conta.saldo });
}

const extrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  if (!numero_conta || !senha) {
    return res.status(400).json({ mensagem: 'Número da conta e senha são obrigatórios!' });
  }

  const conta = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  if (senha !== conta.usuario.senha) {
    return res.status(401).json({ mensagem: 'Senha incorreta!' });
  }

  const transacoesConta = {
    depositos: bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === numero_conta),

    saques: bancoDeDados.saques.filter((saque) => saque.numero_conta === numero_conta),

    transferenciasEnviadas: bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta),

    transferenciasRecebidas: bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta),
  };

  return res.status(200).json(transacoesConta);
}

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  deposito,
  saque,
  transferencia,
  saldo,
  extrato
}