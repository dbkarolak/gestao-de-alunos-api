import { api } from './api.js';
 
export async function cadastrarAluno(adminToken, dadosAluno) {
    const resposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${adminToken}`)
        .send(dadosAluno);
        
    return resposta;
}
 