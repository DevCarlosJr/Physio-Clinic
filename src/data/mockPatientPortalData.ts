import { HomeExerciseDetail, PatientDocumentItem, PastSessionRecord } from '../types/patientPortal';

export const initialHomeExercises: HomeExerciseDetail[] = [
  {
    id: 'ex-1',
    name: 'Ponte Pélvica com Isometria (Glute Bridge)',
    targetRegion: 'Glúteo Máximo, Isquiotibiais e Estabilizadores do Core',
    group: 'Fortalecimento & Estabilização Lombopélvica',
    sets: 3,
    repetitions: '12 repetições',
    holdSeconds: 5,
    frequency: '2 vezes ao dia (manhã e noite)',
    biomechanicalDescription:
      'Deite-se de barriga para cima (decúbito dorsal), joelhos dobrados e pés apoiados no chão na largura dos quadris. Contraia os glúteos e o abdômen e eleve a bacia até que o corpo forme uma linha reta dos joelhos aos ombros. Sustente por 5 segundos no topo sem hiperestender a coluna lombar.',
    breathingTechnique:
      'Inspire pelo nariz com a bacia apoiada; expire lentamente pela boca enquanto eleva a pelve e contrai o abdômen.',
    safetyPrecautions:
      'Não permita que a bacia gire para os lados. Se sentir dor na região lombar baixa, reduza a altura da elevação.',
    isCompletedToday: true,
    completedAt: 'Hoje às 08:30',
    streakDays: 4,
  },
  {
    id: 'ex-2',
    name: 'Ativação Isométrica do Músculo Transverso do Abdômen',
    targetRegion: 'Transverso Abdominal (Cinta Muscular Natural)',
    group: 'Estabilidade Profunda da Coluna',
    sets: 3,
    repetitions: '10 respirações profundas',
    holdSeconds: 8,
    frequency: 'Diariamente',
    biomechanicalDescription:
      'Deitado de costas com pernas fletidas. Coloque os dois dedos das mãos logo abaixo das cristas ilíacas. Puxe o umbigo suavemente em direção à coluna, como se fechasse um zíper apertado, sem prender a respiração.',
    breathingTechnique:
      'Mantenha a respiração suave e contínua pelo tórax enquanto sustenta a contração profunda do abdômen por 8 segundos.',
    safetyPrecautions:
      'Evite empurrar a barriga para fora e não aperte as costas excessivamente contra o chão.',
    isCompletedToday: false,
    streakDays: 3,
  },
  {
    id: 'ex-3',
    name: 'Mobilização em Gato-Camelo (Cat-Cow)',
    targetRegion: 'Mobilidade da Coluna Torácica e Lombar',
    group: 'Mobilidade Articular',
    sets: 2,
    repetitions: '10 ciclos lentos',
    holdSeconds: 3,
    frequency: 'Ao acordar e antes de dormir',
    biomechanicalDescription:
      'Em quatro apoios (mãos sob os ombros e joelhos sob os quadris). Arredonde a coluna suavemente para cima olhando em direção ao umbigo (posição do gato). Em seguida, inverta o movimento, olhando para frente e permitindo que o abdômen afunde suavemente.',
    breathingTechnique:
      'Expire ao arquear a coluna para cima; inspire profundamente ao abaixar a barriga e abrir o peito.',
    safetyPrecautions:
      'Execute os movimentos de forma fluida e sem trancos. Não force a extensão cervical.',
    isCompletedToday: false,
    streakDays: 5,
  },
];

export const initialPatientDocuments: PatientDocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Declaração de Comparecimento Fisioterapêutico',
    category: 'declaration',
    issuedDate: '30/09/2026',
    issuedByName: 'Dr. Lucas Silveira (CREFITO-3 / 245910-F)',
    description: 'Comprovante oficial de presença em sessão clínica das 09h00 às 09h50 para fins laborais/acadêmicos.',
    fileSize: '142 KB (PDF)',
  },
  {
    id: 'doc-2',
    title: 'Recibo de Pagamento para Reembolso (Bradesco Saúde)',
    category: 'receipt',
    issuedDate: '28/09/2026',
    issuedByName: 'PhysioClinic Recepção',
    description: 'Recibo fiscal descritivo com CID-10 M54.5 e registro do profissional executante.',
    fileSize: '185 KB (PDF)',
  },
  {
    id: 'doc-3',
    title: 'Relatório de Evolução Clínica Funcional (Sessão #06)',
    category: 'report',
    issuedDate: '25/09/2026',
    issuedByName: 'Dr. Lucas Silveira',
    description: 'Laudo de evolução com redução da escala de dor EVA de 8/10 para 5/10 e ganho de 30% em ADM de flexão.',
    fileSize: '310 KB (PDF)',
  },
];

export const initialPastSessions: PastSessionRecord[] = [
  {
    id: 'past-6',
    sessionNumber: 6,
    date: '28/09/2026',
    time: '09:00',
    physiotherapistName: 'Dr. Lucas Silveira',
    procedure: 'Cinesioterapia Ativa e Estabilização de Core',
    painLevelBefore: 6,
    painLevelAfter: 3,
    conductSummary: 'Exercícios de ativação de glúteos e transverso do abdômen. Liberação miofascial lombar.',
    physioFeedback: 'Excelente resposta terapêutica. Paciente relata menor rigidez matinal.',
  },
  {
    id: 'past-5',
    sessionNumber: 5,
    date: '25/09/2026',
    time: '09:00',
    physiotherapistName: 'Dr. Lucas Silveira',
    procedure: 'Terapia Manual e Mobilização Articular',
    painLevelBefore: 7,
    painLevelAfter: 4,
    conductSummary: 'Mobilização lombar passiva grau II e III Maitland. TENS analgésico por 20 minutos.',
    physioFeedback: 'Alívio acentuado na dor referida. Orientado a manter as caminhadas diárias.',
  },
  {
    id: 'past-1',
    sessionNumber: 1,
    date: '10/09/2026',
    time: '08:30',
    physiotherapistName: 'Dr. Lucas Silveira',
    procedure: 'Avaliação Funcional Fisioterapêutica Inicial',
    painLevelBefore: 8,
    painLevelAfter: 7,
    conductSummary: 'Anamnese completa, testes ortopédicos especiais, avaliação postural e palpação.',
    physioFeedback: 'Início do plano de tratamento de 12 sessões com foco em estabilização e analgesia.',
  },
];
