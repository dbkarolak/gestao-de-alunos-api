import { api } from './api.js';
 
export async function registrarTrabalho(alunoId, alunoToken, dadosTrabalho) {
    return api()
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${alunoToken}`)
        .send(dadosTrabalho);
}