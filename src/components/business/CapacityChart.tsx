import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface CapacityData {
  hour: string;
  available: number;
  scheduled: number;
  maxCapacity: number;
}

interface CapacityChartProps {
  maxDailyAppointments: number;
  maxSimultaneousAppointments: number;
  minAppointmentInterval: number;
}

export function CapacityChart({
  maxDailyAppointments,
  maxSimultaneousAppointments,
  minAppointmentInterval
}: CapacityChartProps) {
  // Generate hourly data from 8:00 to 18:00
  const generateHourlyData = (): CapacityData[] => {
    const data: CapacityData[] = [];
    const startHour = 8;
    const endHour = 18;
    
    // Calculate appointments per hour based on interval
    const appointmentsPerHour = Math.floor(60 / minAppointmentInterval);
    const totalPossibleAppointments = (endHour - startHour) * appointmentsPerHour;
    
    // Distribute appointments throughout the day
    const averageAppointmentsPerHour = Math.min(
      maxSimultaneousAppointments,
      Math.ceil(maxDailyAppointments / (endHour - startHour))
    );

    for (let hour = startHour; hour <= endHour; hour++) {
      // Simulate a typical day with peak hours
      const isPeakHour = hour >= 11 && hour <= 14;
      const scheduled = isPeakHour 
        ? Math.floor(averageAppointmentsPerHour * 0.8)
        : Math.floor(averageAppointmentsPerHour * 0.5);
      
      data.push({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        available: averageAppointmentsPerHour - scheduled,
        scheduled,
        maxCapacity: maxSimultaneousAppointments
      });
    }

    return data;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-[#1F9AF3] rounded-full mr-2" />
              Disponível: {payload[0].value}
            </p>
            <p className="text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-[#063E65] rounded-full mr-2" />
              Agendado: {payload[1].value}
            </p>
            <p className="text-sm text-gray-600">
              <span className="inline-block w-3 h-3 bg-gray-200 rounded-full mr-2" />
              Capacidade Máxima: {payload[2].value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={generateHourlyData()}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour"
            tick={{ fill: '#666' }}
            tickLine={{ stroke: '#666' }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fill: '#666' }}
            tickLine={{ stroke: '#666' }}
            width={80}
            label={{ 
              value: 'Agendamentos',
              angle: -90,
              position: 'insideLeft',
              style: { fill: '#666', textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="available"
            stackId="1"
            stroke="#1F9AF3"
            fill="#1F9AF3"
            name="Disponível"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="scheduled"
            stackId="1"
            stroke="#063E65"
            fill="#063E65"
            name="Agendado"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="maxCapacity"
            stroke="#e5e7eb"
            fill="#f3f4f6"
            name="Capacidade Máxima"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}