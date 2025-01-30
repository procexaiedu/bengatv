import React from 'react';
import { cn } from '@/lib/utils';
import { DAYS_OF_WEEK, DAY_LABELS } from '@/lib/constants';

interface WeeklyScheduleProps {
  data: { [key: string]: any[] };
  onCellClick: (day: string, hour: number) => void;
  startHour?: number;
  endHour?: number;
  cellComponent?: React.ComponentType<any>;
}

export function WeeklySchedule({
  data,
  onCellClick,
  startHour = 6,
  endHour = 22,
  cellComponent: CellComponent,
}: WeeklyScheduleProps) {
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-px bg-gray-100">
          {/* Header */}
          <div className="h-12 flex items-center justify-center font-medium bg-white">
            Horário
          </div>
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="h-12 flex items-center justify-center font-medium bg-white"
            >
              {DAY_LABELS[day]}
            </div>
          ))}

          {/* Time slots */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="h-12 flex items-center justify-center text-sm text-gray-600 bg-white">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  className={cn(
                    'h-12 bg-white transition-all duration-200',
                    'hover:bg-primary/5 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset',
                    data[day]?.some((slot: any) => 
                      slot.start === `${hour}:00` && slot.end === `${hour + 1}:00`
                    ) && 'bg-primary/10 hover:bg-primary/20'
                  )}
                  onClick={() => onCellClick(day, hour)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${DAY_LABELS[day]} ${hour}:00`}
                >
                  {CellComponent && (
                    <CellComponent
                      day={day}
                      hour={hour}
                      data={data[day]?.find((slot: any) => slot.hour === hour)}
                    />
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}