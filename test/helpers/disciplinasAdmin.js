import { api } from './api.js';
 
export async function cadastrarDisciplina(adminToken, dadosDisciplina) {
    const resposta = await api()
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(dadosDisciplina);
 
    if (resposta.status !== 201) {
        throw new Error(`Falha ao cadastrar disciplina: ${resposta.status} ${JSON.stringify(resposta.body)}`);
    }
    return resposta;
}
 
export async function matricularAlunoNaDisciplina(adminToken, disciplinaId, alunoId) {
    const resposta = await api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ alunoId });
 
    if (resposta.status !== 201) {
        throw new Error(`Falha ao matricular aluno: ${resposta.status} ${JSON.stringify(resposta.body)}`);
    }
    return resposta;
}