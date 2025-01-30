import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BusinessHour, Break } from '@/types/business';

interface DayScheduleProps {
  value: BusinessHour;
  onChange: (value: BusinessHour) => void;
}

export function DaySchedule({ value, onChange }: DayScheduleProps) {
  const addBreak = () => {
    onChange({
      ...value,
      breaks: [...value.breaks, { start: '12:00', end: '13:00' }],
    });
  };

  const removeBreak = (index: number) => {
    onChange({
      ...value,
      breaks: value.breaks.filter((_, i) => i !== index),
    });
  };

  const updateBreak = (index: number, field: keyof Break, newValue: string) => {
    onChange({
      ...value,
      breaks: value.breaks.map((brk, i) =>
        i === index ? { ...brk, [field]: newValue } : brk
      ),
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg animate-in slide-in-from-top">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Abertura</label>
          <Input
            type="time"
            value={value.open}
            onChange={(e) => onChange({ ...value, open: e.target.value })}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fechamento</label>
          <Input
            type="time"
            value={value.close}
            onChange={(e) => onChange({ ...value, close: e.target.value })}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Intervalos</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 hover:bg-primary hover:text-white transition-colors"
            onClick={addBreak}
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Intervalo
          </Button>
        </div>

        {value.breaks.map((brk, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="time"
              value={brk.start}
              onChange={(e) => updateBreak(index, 'start', e.target.value)}
              className="w-32"
            />
            <span>até</span>
            <Input
              type="time"
              value={brk.end}
              onChange={(e) => updateBreak(index, 'end', e.target.value)}
              className="w-32"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeBreak(index)}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}