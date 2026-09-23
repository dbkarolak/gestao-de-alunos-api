//import request from 'supertest'; // substituído pelo helper api(), que importa o supertest
import { expect } from 'chai';
//import mongoose from 'mongoose'; // usado apenas pelo after() abaixo, que saiu junto
//import app from '../src/app.js'; // o app não é mais carregado aqui, quem roda a API é o npm run dev
import { api } from './helpers/api.js'; // centraliza a BASE_URL e o supertest

describe('POST /api/auth/login', () => {
  // after(async () => {                       // era necessário porque importar o app executava,
  //   await mongoose.connection.close();      // em cascata, o mongoose.connect() do database/db.js:
  // });                                       // a conexão ficava aberta e o processo não encerrava

  it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {
    const resposta = await api() // era request(app): subia a aplicação em memória, sem passar pela rede
      .post('/api/auth/login')
      .send({ email: process.env.ADMIN_EMAIL, senha: process.env.ADMIN_SENHA }); // substituido pelas variaveis

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.have.property('token');
  });

  it('deve retornar 401 quando a senha informada for inválida', async () => {
    const resposta = await api() // era request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@escola.com', senha: 'senha-incorreta' });

    expect(resposta.status).to.equal(401);
    expect(resposta.body.error).to.equal('E-mail ou senha inválidos.');
  });
});