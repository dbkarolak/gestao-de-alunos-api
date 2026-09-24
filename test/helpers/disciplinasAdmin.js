import { api } from './api.js';
 
export async function cadastrarDisciplina(adminToken, dadosDisciplina) {
    const resposta = await api()
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${adminToken}`)
        .send(dadosDisciplina);

    return resposta;
}
 
export async function matricularAlunoNaDisciplina(adminToken, disciplinaId, alunoId) {
    const resposta = await api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `${adminToken}`)
        .send({ alunoId });
        
    return resposta;
}