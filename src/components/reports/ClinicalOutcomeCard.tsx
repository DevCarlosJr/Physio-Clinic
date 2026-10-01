import React from 'react';
import { Activity, TrendingDown, Award } from 'lucide-react';
import { ClinicalOutcomeMetric } from '../../types/reports';

interface ClinicalOutcomeCardProps {
  outcomes: ClinicalOutcomeMetric[];
}

export const ClinicalOutcomeCard: React.FC<ClinicalOutcomeCardProps> = ({ outcomes }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Desfechos Clínicos: Alívio da Dor (Escala EVA)
            </h3>
            <p className="text-xs text-slate-500">
              Comparativo de admissão vs última sessão por área de atuação
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-bold">
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          Média de Alívio: -5.1 pontos EVA
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {outcomes.map((item) => (
          <div
            key={item.category}
            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-900">{item.category}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[11px] border border-emerald-200">
                {item.reliefPercentage}% alívio
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-center flex-1">
                <span className="text-[10px] text-slate-400 block">Admissão</span>
                <span className="font-mono font-bold text-rose-600 text-sm">
                  {item.initialPainEVA} / 10
                </span>
              </div>

              <div className="px-2 text-slate-300">→</div>

              <div className="text-center flex-1">
                <span className="text-[10px] text-slate-400 block">Atual</span>
                <span className="font-mono font-bold text-teal-700 text-sm">
                  {item.currentPainEVA} / 10
                </span>
              </div>

              <div className="px-2 text-slate-300">|</div>

              <div className="text-center flex-1">
                <span className="text-[10px] text-slate-400 block">Sessões Médias</span>
                <span className="font-mono font-bold text-slate-700 text-sm">
                  {item.avgSessionsCompleted} sessões
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
