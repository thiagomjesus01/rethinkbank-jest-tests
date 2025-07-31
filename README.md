# Testes E2E RethinkBank

Este repositório contém os testes de API da jornada do usuário no sistema RethinkBank.

## Como rodar

```bash
npm install
npm run test:e2e
```

## Gerar evidência de execução

```bash
npm run test:log
```

## Cobertura de Testes

- ✅ Cadastro válido
- ✅ Confirmação de e-mail
- ✅ Login com sucesso
- ✅ Envio de pontos
- ✅ Depósito na caixinha
- ✅ Consulta de saldo
- ✅ Exclusão de conta
- 🔁 Fluxos inválidos:
  - CPF inválido no cadastro
  - Senha incorreta no login
  - Envio de pontos sem saldo
  - Token expirado

## Evidências de Testes

- Log de execução: `evidencias/teste.log` (gerado automaticamente)