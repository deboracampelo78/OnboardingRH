import { OnboardingEtapaInput } from '../services/api';

function item(titulo: string) {
  return { titulo, concluida: false };
}

export const TEMPLATE_PADRAO_ETAPAS: OnboardingEtapaInput[] = [
  {
    titulo: 'Documentação e acessos',
    periodo: 'Dia 1',
    itens: [
      item('Assinar o contrato digital no portal Meu RH'),
      item('Enviar foto para o crachá'),
      item('Confirmar o recebimento do notebook'),
      item('Trocar a senha provisória do e-mail corporativo'),
      item('Configurar o autenticador (MFA)'),
    ],
  },
  {
    titulo: 'Ambiente e ferramentas',
    periodo: 'Dias 2 e 3',
    itens: [
      item('Entrar nos canais do Teams do time'),
      item('Configurar a assinatura de e-mail no padrão Benner'),
      item('Acessar o Portal do Colaborador'),
      item('Registrar o primeiro ponto'),
    ],
  },
  {
    titulo: 'Pessoas e cultura',
    periodo: 'Semana 1',
    itens: [
      item('Conversa inicial com o gestor direto'),
      item('Apresentação ao time'),
      item(
        'Conhecer o buddy designado (se não souber quem é, perguntar ao gestor)'
      ),
    ],
  },
  {
    titulo: 'Treinamentos',
    periodo: 'Semana 2',
    itens: [
      item('Segurança da Informação'),
      item('Código de Conduta'),
      item('LGPD para colaboradores'),
      item('Boas-vindas ao produto'),
    ],
  },
  {
    titulo: 'Checkpoint',
    periodo: 'Dia 30',
    itens: [
      item('Responder: o que está mais claro hoje do que estava no primeiro dia?'),
      item('Responder: o que ainda está confuso?'),
      item('Responder: faltou algum acesso ou ferramenta?'),
    ],
  },
];
