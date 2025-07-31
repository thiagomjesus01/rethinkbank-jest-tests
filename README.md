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


a- Há bugs? Se sim, quais são e quais são os cenários esperados?

Sim, 

[❌] Token expira muito rápido (10min), pode atrapalhar testes longos.

[⚠️] Não há verificação de e-mail duplicado antes do login.

[❌] Login aceita usuários deletados (soft delete).


b- Se houver bugs, classifique-os em nível de criticidade.

Alta: Soft delete sem impedir login → falha de segurança.

Média: Token expira rápido demais para testes manuais.

Baixa: Mensagens poderiam ter mais detalhes.

c- Diante do cenário, o sistema está pronto para subir em produção?

Não. Por conta da falha de segurança no soft delete e falta de bloqueio de login para usuários excluídos.
