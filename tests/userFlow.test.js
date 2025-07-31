const client = require('../utils/apiClient');

let confirmToken, sessionToken;
let testUser = {
  cpf: Math.floor(Math.random() * 1e11).toString().padStart(11, '0'),
  full_name: "Thiago Jesus",
  email: `thiago.${Date.now()}@teste.com`,
  password: "Senha@123",
  confirmPassword: "Senha@123"
};

describe("Jornada completa do usuário", () => {
  test("1 - Cadastro", async () => {
    const res = await client.post('/cadastro', testUser);
    expect(res.status).toBe(201);
    confirmToken = res.data.confirmToken;
  });

  test("2 - Confirmação de e-mail", async () => {
    const res = await client.get(`/confirm-email?token=${confirmToken}`);
    expect(res.status).toBe(200);
  });

  test("3 - Login", async () => {
    const res = await client.post('/login', {
      email: testUser.email,
      password: testUser.password
    });
    expect(res.status).toBe(200);
    sessionToken = res.data.token;
  });

  test("4 - Guardar pontos na caixinha", async () => {
    const res = await client.post('/caixinha/deposit', { amount: 30 }, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    expect(res.status).toBe(200);
  });

  test("5 - Consultar saldo", async () => {
    const res = await client.get('/points/saldo', {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("normal_balance");
  });

  test("6 - Excluir conta", async () => {
    const res = await client.delete('/account', {
      headers: { Authorization: `Bearer ${sessionToken}` },
      data: { password: testUser.password }
    });
    expect(res.status).toBe(200);
  });
});

describe("Cenários de falha", () => {
  test("Cadastro com CPF inválido", async () => {
    const res = await client.post('/cadastro', {
      cpf: "12345678",
      full_name: "Nome Teste",
      email: `email${Date.now()}@teste.com`,
      password: "Senha@123",
      confirmPassword: "Senha@123"
    }).catch(err => err.response);
    expect(res.status).toBe(400);
  });

  test("Login com senha errada", async () => {
    const email = `email${Date.now()}@teste.com`;
    await client.post('/cadastro', {
      cpf: Math.floor(Math.random() * 1e11).toString().padStart(11, '0'),
      full_name: "Nome Teste",
      email,
      password: "Senha@123",
      confirmPassword: "Senha@123"
    });
    const res = await client.post('/login', {
      email,
      password: "SenhaErrada@123"
    }).catch(err => err.response);
    expect([401, 403]).toContain(res.status);
  });

  test("Enviar pontos sem saldo suficiente", async () => {
    const user = {
      cpf: Math.floor(Math.random() * 1e11).toString().padStart(11, '0'),
      full_name: "Usuário Teste",
      email: `email${Date.now()}@test.com`,
      password: "Senha@123",
      confirmPassword: "Senha@123"
    };

    const cadastro = await client.post('/cadastro', user);
    await client.get(`/confirm-email?token=${cadastro.data.confirmToken}`);
    const login = await client.post('/login', {
      email: user.email,
      password: user.password
    });

    const token = login.data.token;

    const res = await client.post('/points/send', {
      recipientCpf: "00000000000",
      amount: 9999
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => err.response);

    expect(res.status).toBe(400);
  });

  test("Token expirado simulado", async () => {
    const res = await client.get('/points/saldo', {
      headers: { Authorization: `Bearer token_expirado_fake` }
    }).catch(err => err.response);
    expect([401, 403]).toContain(res.status);
  });
});