import React from 'react';
import { Activity, TrendingDown, CheckCircle2 } from 'lucide-react';
import { SoapEvolutionRecord } from '../../types/medicalRecord';

interface PainEvolutionChartProps {
  evolutions: SoapEvolutionRecord[];
  initialPain: number;
}

export const PainEvolutionChart: React.FC<PainEvolutionChartProps> = ({
  evolutions,
  initialPain,
}) => {
  // Sort from session 1 to latest
  const sortedSessions = [...evolutions].sort((a, b) => a.sessionNumber - b.sessionNumber);

  // If no sessions, fallback
  const sessionPoints = sortedSessions.map((s) => ({
    label: `Sessão ${s.sessionNumber}`,
    date: s.date,
    painBefore: s.painBeforeEVA,
    painAfter: s.painAfterEVA,
  }));

  const currentPain = sessionPoints.length > 0 ? sessionPoints[sessionPoints.length - 1].painAfter : initialPain;
  const painDrop = initialPain - currentPain;
  const percentageDrop = Math.round((painDrop / (initialPain || 1)) * 100);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
      {/* Header Metric */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Curva de Evolução da Dor (Escala EVA 0 a 10)
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhamento longitudinal de alívio sintomático pós-condutas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 text-xs font-bold">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span>Redução de {painDrop} pontos ({percentageDrop}% de alívio)</span>
        </div>
      </div>

      {/* Visual Chart Bars and Trendline */}
      <div className="pt-2">
        <div className="grid grid-cols-6 gap-3 items-end h-44 pb-6 border-b border-slate-200 px-2">
          {sessionPoints.map((pt, idx) => {
            const heightPercent = Math.max(pt.painAfter * 10, 10);
            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full group">
                {/* Tooltip / Badge */}
                <span className="font-mono font-black text-xs text-slate-700 mb-1 group-hover:text-teal-700 transition-colors">
                  {pt.painAfter}/10
                </span>

                {/* Bar */}
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg relative flex items-end justify-center overflow-hidden h-32">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      pt.painAfter <= 3
                        ? 'bg-emerald-500'
                        : pt.painAfter <= 6
                        ? 'bg-teal-600'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                {/* Session Label */}
                <span className="text-[10px] font-semibold text-slate-600 mt-2 truncate max-w-full">
                  Sessão #{idx + 1}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {pt.date.split('/')[0]}/{pt.date.split('/')[1]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Dor Intensa (7-10)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Dor Moderada (4-6)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Dor Leve / Remissão (0-3)
            </span>
          </div>

          <span className="font-medium text-slate-600">
            Admissão: <strong className="text-rose-600">EVA {initialPain}</strong> → Atual: <strong className="text-emerald-700">EVA {currentPain}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
