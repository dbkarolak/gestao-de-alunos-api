import { api } from './api.js';
import { comTokenDeAdmin } from './auth.js';

export async function limparDadosDoTeste({ dadosAluno, dadosDisciplina }) {
    const auth = await comTokenDeAdmin();

    const alunos = await api().get('/api/admin/alunos').set('Authorization', auth);
    const aluno = alunos.body.find((a) => a.email === dadosAluno.email || a.matricula === dadosAluno.matricula);

    if (aluno) {
        const trabalhos = await api().get(`/api/admin/trabalhos?alunoId=${aluno.id}`).set('Authorization', auth);
        for (const trabalho of trabalhos.body) {
            await api().delete(`/api/admin/trabalhos/${trabalho.id}`).set('Authorization', auth);
        }
        await api().delete(`/api/admin/alunos/${aluno.id}`).set('Authorization', auth);
    }

    const disciplinas = await api().get('/api/admin/disciplinas').set('Authorization', auth);
    const disciplina = disciplinas.body.find((d) => d.codigo === dadosDisciplina.codigo);
    if (disciplina) {
        await api().delete(`/api/admin/disciplinas/${disciplina.id}`).set('Authorization', auth);
    }
}