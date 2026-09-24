import { expect } from 'chai';
import { comTokenDeAdmin, getToken } from '../helpers/auth.js';
import { cadastrarAluno } from '../helpers/alunosAdmin.js';
import { cadastrarDisciplina, matricularAlunoNaDisciplina } from '../helpers/disciplinasAdmin.js';
import { registrarTrabalho } from '../helpers/autoAtendimentoAluno.js';
import { limparDadosDoTeste } from '../helpers/limpezaDeDados.js';
import testesDeEntregaTrabalhos from '../fixtures/dados.json' with { type: 'json' };

describe('Cadastro de Aluno e Entrega de Trabalho', () => {
    testesDeEntregaTrabalhos.forEach((testeDeEntregaTrabalho) => {
        it(testeDeEntregaTrabalho.testTitle, async () => {
            const { dadosAluno, dadosDisciplina, dadosTrabalho, statusCodeEsperado } = testeDeEntregaTrabalho;

            // Arrange
            await limparDadosDoTeste(testeDeEntregaTrabalho);

            const adminToken = await comTokenDeAdmin();

            const cadastroAlunoResposta = await cadastrarAluno(adminToken, dadosAluno);
            expect(cadastroAlunoResposta.status, 'cadastro do aluno').to.equal(201);
            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await cadastrarDisciplina(adminToken, dadosDisciplina);
            expect(cadastroDisciplinaResposta.status, 'cadastro da disciplina').to.equal(201);
            const disciplinaId = cadastroDisciplinaResposta.body.id;

            const matriculaResposta = await matricularAlunoNaDisciplina(adminToken, disciplinaId, alunoId);
            expect(matriculaResposta.status, 'matrícula do aluno na disciplina').to.equal(201);

            const alunoToken = await getToken(dadosAluno.email, dadosAluno.senha);
            expect(alunoToken, 'token do aluno').to.be.a('string');

            // Act
            const registroTrabalhoResposta = await registrarTrabalho(alunoId, alunoToken, {
                disciplinaId: disciplinaId,
                ...dadosTrabalho
            });

            // Assert
            expect(registroTrabalhoResposta.status).to.equal(statusCodeEsperado);
            expect(registroTrabalhoResposta.body).to.include({
                alunoId: alunoId,
                disciplinaId: disciplinaId,
                titulo: dadosTrabalho.titulo,
                descricao: dadosTrabalho.descricao,
                status: 'entregue'
            });
            expect(registroTrabalhoResposta.body.nota).to.be.null;
            expect(registroTrabalhoResposta.body.feedback).to.be.null;
            expect(registroTrabalhoResposta.body.dataEntrega).to.exist.and.not.be.empty;
        });
    });
});