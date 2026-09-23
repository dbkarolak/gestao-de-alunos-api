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
            const { body: aluno } = await cadastrarAluno(adminToken, dadosAluno);
            const { body: disciplina } = await cadastrarDisciplina(adminToken, dadosDisciplina);
            await matricularAlunoNaDisciplina(adminToken, disciplina.id, aluno.id);

            const alunoToken = await getToken(dadosAluno.email, dadosAluno.senha);

            // Act
            const registroTrabalhoResposta = await registrarTrabalho(aluno.id, alunoToken, {
                disciplinaId: disciplina.id,
                ...dadosTrabalho
            });

            // Assert
            expect(registroTrabalhoResposta.status).to.equal(statusCodeEsperado);
            expect(registroTrabalhoResposta.body).to.include({
                alunoId: aluno.id,
                disciplinaId: disciplina.id,
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