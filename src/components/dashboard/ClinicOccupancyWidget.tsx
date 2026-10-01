import React from 'react';
import { DoorOpen, CheckCircle, Clock } from 'lucide-react';

interface RoomStatus {
  name: string;
  type: string;
  currentPatient?: string;
  status: 'occupied' | 'available' | 'cleaning';
  nextTime?: string;
}

const rooms: RoomStatus[] = [
  {
    name: 'Box 01',
    type: 'Cinesioterapia',
    currentPatient: 'Carlos Eduardo Santos',
    status: 'occupied',
    nextTime: 'Livre às 09:50',
  },
  {
    name: 'Box 02',
    type: 'Traumato-Ortopedia',
    status: 'available',
    nextTime: 'Próximo: 11:15',
  },
  {
    name: 'Sala 03',
    type: 'RPG & Postura',
    status: 'available',
    nextTime: 'Próximo: 10:00',
  },
  {
    name: 'Box 04',
    type: 'Eletrotermofototerapia',
    status: 'available',
    nextTime: 'Próximo: 14:00',
  },
];

export const ClinicOccupancyWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DoorOpen className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Ocupação das Salas & Boxes
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          1 em uso • 3 disponíveis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rooms.map((room) => {
          const isOccupied = room.status === 'occupied';
          return (
            <div
              key={room.name}
              className={`p-3 rounded-lg border transition-all ${
                isOccupied
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{room.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOccupied ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{room.type}</p>
              
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                {isOccupied ? (
                  <span className="font-semibold text-amber-900 truncate">
                    {room.currentPatient}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Disponível
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {room.nextTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
