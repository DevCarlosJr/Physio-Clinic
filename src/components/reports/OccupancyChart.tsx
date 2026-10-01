import React from 'react';
import { DoorOpen, TrendingUp, CheckCircle2 } from 'lucide-react';
import { ClinicOccupancyMetric } from '../../types/reports';

interface OccupancyChartProps {
  occupancyData: ClinicOccupancyMetric[];
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ occupancyData }) => {
  const avgOccupancy = Math.round(
    occupancyData.reduce((acc, curr) => acc + curr.occupancyPercentage, 0) / (occupancyData.length || 1)
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Taxa de Ocupação dos Boxes & Salas
            </h3>
            <p className="text-xs text-slate-500">
              Capacidade produtiva real vs horas disponíveis no mês
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl text-teal-800 text-xs font-bold">
          <span>Ocupação Global: {avgOccupancy}%</span>
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {occupancyData.map((box) => (
          <div key={box.boxId} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{box.boxName}</span>
              <span className="font-mono font-bold text-slate-900">
                {box.occupancyPercentage}% ({box.occupiedHours}h / {box.totalAvailableHours}h)
              </span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${box.occupancyPercentage}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  box.occupancyPercentage >= 85
                    ? 'bg-teal-600'
                    : box.occupancyPercentage >= 75
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span>Meta operacional da clínica: <strong>80% de ocupação</strong></span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Meta superada em 3 de 4 ambientes
        </span>
      </div>
    </div>
  );
};
