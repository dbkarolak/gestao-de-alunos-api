import { api } from './api.js';
 
export async function cadastrarAluno(adminToken, dadosAluno) {
    const resposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `${adminToken}`)
        .send(dadosAluno);
 
    if (resposta.status !== 201) {
        throw new Error(`Falha ao cadastrar aluno: ${resposta.status} ${JSON.stringify(resposta.body)}`);
    }
    return resposta;
}
 