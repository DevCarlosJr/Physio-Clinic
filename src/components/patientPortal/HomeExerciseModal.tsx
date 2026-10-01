import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { HomeExerciseDetail } from '../../types/patientPortal';
import {
  Dumbbell,
  CheckCircle2,
  Wind,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

interface HomeExerciseModalProps {
  exercise: HomeExerciseDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
}

export const HomeExerciseModal: React.FC<HomeExerciseModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onToggleComplete,
}) => {
  if (!isOpen || !exercise) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={exercise.name}
      subtitle={`Prescrito pelo seu Fisioterapeuta • ${exercise.group}`}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fechar
          </Button>

          <Button
            variant={exercise.isCompletedToday ? 'secondary' : 'primary'}
            size="sm"
            icon={exercise.isCompletedToday ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            onClick={() => {
              onToggleComplete(exercise.id);
              onClose();
            }}
          >
            {exercise.isCompletedToday ? 'Feito Hoje (Desmarcar)' : 'Marcar como Concluído Hoje'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-center">
            <span className="text-[10px] text-teal-700 block font-semibold">Volume</span>
            <span className="text-base font-bold text-teal-900 font-mono">
              {exercise.sets} séries
            </span>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-center">
            <span className="text-[10px] text-teal-700 block font-semibold">Repetições / Tempo</span>
            <span className="text-xs font-bold text-teal-900 font-mono">
              {exercise.repetitions}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-center">
            <span className="text-[10px] text-amber-700 block font-semibold">Sequência Ativa</span>
            <span className="text-sm font-bold text-amber-900 flex items-center justify-center gap-1 font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              {exercise.streakDays} dias seguidos
            </span>
          </div>
        </div>

        {/* Biomechanical Execution Guide */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-teal-600" />
            Instruções de Execução Biomecânica
          </h4>
          <p className="text-slate-600 leading-relaxed text-xs">
            {exercise.biomechanicalDescription}
          </p>
        </div>

        {/* Breathing Rhythm */}
        <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/60 space-y-1.5 text-sky-900">
          <h4 className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-sky-800">
            <Wind className="w-3.5 h-3.5 text-sky-600" />
            Orientações de Respiração e Ritmo
          </h4>
          <p className="text-xs leading-relaxed text-sky-800">
            {exercise.breathingTechnique}
          </p>
        </div>

        {/* Safety Precautions */}
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1.5 text-rose-900">
          <h4 className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Cuidados & Contraindicações
          </h4>
          <p className="text-xs leading-relaxed text-rose-800">
            {exercise.safetyPrecautions}
          </p>
        </div>
      </div>
    </Modal>
  );
};
