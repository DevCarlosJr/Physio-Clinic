import { FunctionalAssessment, SoapEvolutionRecord, MedicalTimelineItem } from '../types/medicalRecord';

export const mockCarlosAssessment: FunctionalAssessment = {
  id: 'asm-carlos-1',
  patientId: 'pat-2',
  patientName: 'Carlos Eduardo Santos',
  patientAge: 39,
  evaluatedAt: '10/09/2026 às 08:30',
  evaluatorPhysioName: 'Dr. Lucas Silveira',
  evaluatorCrefito: 'CREFITO-3 / 245910-F',

  chiefComplaint: 'Dor intensa e queimação na coluna lombar baixa (L4-L5/L5-S1) com irradiação para glúteo esquerdo ao permanecer sentado.',
  historyCurrentIllness:
    'Paciente relata início insidioso há 6 meses, agravado nas últimas 3 semanas por longas jornadas de trabalho em home-office (8-10 horas diárias). Ressonância Magnética realizada em 25/08/2026 demonstrou protrusão discal póstero-lateral esquerda em L4-L5 sem compressão foraminal franca.',
  pastMedicalHistory:
    'Hipertenso leve controlado com Losartana 50mg/dia. Nega cirurgias ortopédicas prévias. Sem histórico de fraturas vertebrais.',
  lifestyleHabits:
    'Sedentário no último ano. Trabalha sentado em cadeira semi-ergonômica. Tabagismo negativo. Sono não reparador decorrente do desconforto lombar noturno.',

  painLocation: 'Região paravertebral lombar baixa bilateral (predomínio hemisfério esquerdo) com irradiação glútea ipsilateral.',
  painType: 'Dor em queimação e pontada ao flexionar o tronco.',
  initialPainScaleEVA: 8,
  aggravatingFactors: 'Posição sentada contínua (> 30 min), flexão anterior de coluna, tosse e esforço físico.',
  relievingFactors: 'Decúbito dorsal com membros inferiores elevados a 90° e compressa quente.',

  posturalInspection:
    'Retificação de lordose lombar fisiológica, assimetria de cristas ilíacas com elevação discreta à esquerda (+0,5 cm), báscula pélvica anterior compensatória e anteriorização da cabeça.',
  palpationFindings:
    'Espasmo muscular moderado a grave em feixes profundos de eretores da espinha e quadrado lombar bilateral. Pontos-gatilho miofasciais ativos no glúteo médio esquerdo.',
  rangeOfMotionADM:
    'Flexão de tronco com limitação álgica (distância dedo-chão de 28 cm). Extensão com 10° (reduzida). Inclinações laterais simétricas preservadas em 25° bilateral.',
  muscleStrengthMRC:
    'Glúteo Médio: Grau 3/5 bilateral; Transverso do Abdômen e Multífidos: Grau 3/5 com falha no recrutamento motor profundo; Quadríceps e Isquiotibiais: Grau 5/5 bilateral.',
  specialOrthopedicTests:
    'Teste de Lasègue negativo bilateralmente até 70°; Teste de Slump positivo à esquerda com reprodução da dor glútea; Teste de Patrick-FABER negativo.',

  functionalPhysioDiagnosis:
    'Disfunção biomecânica lombopélvica decorrente de discopatia degenerativa L4-L5, caracterizada por hipomobilidade articular lombar, instabilidade do core profundo e retificação postural.',
  shortTermGoals:
    'Reduzir dor de EVA 8 para EVA ≤ 4 em 4 semanas; inibir contraturas miofasciais paravertebrais e restaurar mobilidade de flexão de tronco.',
  longTermGoals:
    'Fortalecer estabilizadores profundos (transverso/multífidos/glúteos); retorno seguro a exercícios físicos regulares e reeducação ergonômica laboral.',
  therapeuticPlan:
    'Programa de 12 sessões com frequência de 2x por semana, integrando terapia manual (Maitland), liberação miofascial, eletroanalgesia (TENS), cinesioterapia de core e orientações posturais domiciliares.',
  plannedSessionsCount: 12,
};

export const mockCarlosEvolutions: SoapEvolutionRecord[] = [
  {
    id: 'ev-6',
    sessionNumber: 6,
    date: '28/09/2026',
    time: '09:00',
    physiotherapistName: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    subjective:
      'Paciente comparece relatando melhora expressiva nos últimos 4 dias. Conseguiu trabalhar sentado por 2 horas consecutivas sem queixas incapacitantes. Nega novos episódios de irradiação glútea.',
    objective:
      'Distância dedo-chão reduzida para 10 cm (ganho de 18 cm em relação à avaliação inicial). Tensão muscular paravertebral discreta (grau leve). Ativação de transverso do abdômen executada com controle motor consistente.',
    assessment:
      'Evolução satisfatória do quadro álgico e funcional. Redução sustentada de 5 pontos na escala EVA em relação à admissão.',
    plan:
      'Progressão de carga nos exercícios de ponte e prancha modificada. Manter 2x por semana até a 8ª sessão.',
    painBeforeEVA: 5,
    painAfterEVA: 3,
    conductsApplied: [
      'Cinesioterapia Ativa e Resistida',
      'Liberação Miofascial Instrumental (IASTM)',
      'Fortalecimento Isométrico de Core',
    ],
    homeCarePrescription:
      'Manter os 3 exercícios diários prescritos no aplicativo. Pausas ativas a cada 90 minutos de trabalho.',
    lockedTimestamp: 1727521200000,
    signatureHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  },
  {
    id: 'ev-5',
    sessionNumber: 5,
    date: '25/09/2026',
    time: '09:00',
    physiotherapistName: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    subjective:
      'Relata sono de melhor qualidade. Queixa residual apenas ao levantar-se da cama pela manhã.',
    objective:
      'Palpação com dor grau leve em L4-L5. Sem dor à extensão lombar. Teste de Slump negativo.',
    assessment:
      'Alívio acentuado da componente inflamatória discal.',
    plan:
      'Introdução de exercícios de estabilidade lombo-pélvica com bola suíça.',
    painBeforeEVA: 6,
    painAfterEVA: 4,
    conductsApplied: [
      'Mobilização Articular Passiva (Maitland)',
      'Eletroterapia Analgésica (TENS Convencional)',
      'Treino de Estabilidade e Propriocepção',
    ],
    homeCarePrescription:
      'Compressa morna lombar à noite por 20 minutos.',
    lockedTimestamp: 1727262000000,
    signatureHash: 'SHA256:1a85b922a947fd0c9d7429188bf246c433100be0516ff1a3b839aa64082269c2',
  },
  {
    id: 'ev-4',
    sessionNumber: 4,
    date: '21/09/2026',
    time: '09:00',
    physiotherapistName: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    subjective:
      'Refere dor localizada em faixa lombar, sem irradiação. Sentiu alívio com a prática dos exercícios em casa.',
    objective:
      'Espasmo paravertebral moderado, mas sem rigidez em bloco. ADM de flexão com melhora de 15%.',
    assessment:
      'Início da fase intermediária do protocolo terapêutico.',
    plan:
      'Continuidade de liberação miofascial e fortalecimento isométrico.',
    painBeforeEVA: 6,
    painAfterEVA: 5,
    conductsApplied: [
      'Cinesioterapia Ativa e Resistida',
      'Alongamento Estático de Cadeia Posterior',
    ],
    homeCarePrescription: 'Alongamento de cadeia posterior 2x ao dia.',
    lockedTimestamp: 1726916400000,
    signatureHash: 'SHA256:9b1a78e4d29381676df4d2d4b1fa3d677284addd200126d9069123456789abcd',
  },
  {
    id: 'ev-3',
    sessionNumber: 3,
    date: '17/09/2026',
    time: '08:30',
    physiotherapistName: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    subjective: 'Menor sensação de peso no final do dia de trabalho.',
    objective: 'Diminuição dos pontos-gatilho glúteos. Sensibilidade palpatória reduzida.',
    assessment: 'Quadro álgico respondendo positivamente à eletroterapia e terapia manual.',
    plan: 'Progredir para exercícios de ativação neuromuscular.',
    painBeforeEVA: 7,
    painAfterEVA: 6,
    conductsApplied: [
      'Liberação Miofascial Instrumental (IASTM)',
      'Eletroterapia Analgésica (TENS Convencional)',
    ],
    homeCarePrescription: 'Evitar permanecer sentado por mais de 45 minutos contínuos.',
    lockedTimestamp: 1726570800000,
    signatureHash: 'SHA256:4f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d8888',
  },
  {
    id: 'ev-2',
    sessionNumber: 2,
    date: '14/09/2026',
    time: '08:30',
    physiotherapistName: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    subjective: 'Dor ainda presente na primeira hora da manhã, mas sem piora aguda após a 1ª sessão.',
    objective: 'Contratura paravertebral presente. Manobra de Lasègue negativa.',
    assessment: 'Adaptação tolerada sem intercorrências ou rebotes álgicos.',
    plan: 'Foco na desativação dos pontos-gatilho e liberação miofascial.',
    painBeforeEVA: 8,
    painAfterEVA: 7,
    conductsApplied: [
      'Liberação Miofascial Instrumental (IASTM)',
      'Mobilização Articular Passiva (Maitland)',
    ],
    homeCarePrescription: 'Aplicação de calor superficial morno por 20 minutos à noite.',
    lockedTimestamp: 1726311600000,
    signatureHash: 'SHA256:2f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d7777',
  },
  {
    id: 'ev-1',
    sessionNumber: 1,
    date: '10/09/2026',
    time: '09:00',
    physiotherapistName: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    subjective: 'Primeira sessão pós-avaliação diagnóstica. Queixa de dor intensa ao sentar (EVA 8).',
    objective: 'Retificação lombar marcante e espasmo muscular profundo. Distância dedo-chão de 28 cm.',
    assessment: 'Início do plano terapêutico com foco na analgesia e inibição neuromuscular.',
    plan: 'TENS analgésico e mobilização grau I/II.',
    painBeforeEVA: 8,
    painAfterEVA: 7,
    conductsApplied: [
      'Eletroterapia Analgésica (TENS Convencional)',
      'Mobilização Articular Passiva (Maitland)',
    ],
    homeCarePrescription: 'Início dos exercícios respiratórios diafragmáticos.',
    lockedTimestamp: 1725966000000,
    signatureHash: 'SHA256:1f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d6666',
  },
];

export const mockCarlosTimeline: MedicalTimelineItem[] = [
  {
    id: 'tl-1',
    type: 'assessment',
    date: '10/09/2026',
    title: 'Avaliação Fisioterapêutica Inicial & Anamnese',
    author: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    summary: 'Diagnóstico funcional de disfunção lombopélvica e protrusão L4-L5. Plano terapêutico de 12 sessões aprovado.',
    painEVA: 8,
  },
  {
    id: 'tl-2',
    type: 'session',
    date: '14/09/2026',
    title: 'Sessão #02 • Terapia Manual e Liberação Miofascial',
    author: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    summary: 'Desativação de pontos-gatilho paravertebrais e mobilização Maitland.',
    painEVA: 7,
  },
  {
    id: 'tl-3',
    type: 'session',
    date: '21/09/2026',
    title: 'Sessão #04 • Cinesioterapia & Fortalecimento de Core',
    author: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    summary: 'Início de ativação do transverso abdominal e ponte isométrica.',
    painEVA: 5,
  },
  {
    id: 'tl-4',
    type: 'session',
    date: '28/09/2026',
    title: 'Sessão #06 • Cinesioterapia Intermediária',
    author: 'Dr. Lucas Silveira',
    crefito: 'CREFITO-3 / 245910-F',
    summary: 'Ganho expressivo em ADM (+18 cm na flexão anterior). Dor em nível basal leve (EVA 3).',
    painEVA: 3,
  },
];
