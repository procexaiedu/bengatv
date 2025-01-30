import React, { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays, 
  Loader2,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Minus
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { WeeklySchedule } from "@/components/business/WeeklySchedule";
import { DaySchedule } from "@/components/business/DaySchedule";
import { DAYS_OF_WEEK, DAY_LABELS, WEEKDAYS, WEEKEND, NATIONAL_HOLIDAYS, COMMON_SERVICES, VISIT_DURATION_PRESETS } from "@/lib/constants";
import type { BusinessHoursFormData } from "@/types/business";

const businessHoursSchema = z.object<z.ZodType<BusinessHoursFormData>>({
  businessHours: z.object({
    monday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    }),
    tuesday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    }),
    wednesday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    }),
    thursday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    }),
    friday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    }),
    saturday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    }),
    sunday: z.object({
      open: z.string(),
      close: z.string(),
      enabled: z.boolean(),
      breaks: z.array(z.object({ start: z.string(), end: z.string() }))
    })
  }),
  averageVisitDuration: z.number().min(5).max(240),
  holidays: z.array(z.date()),
  ticketAverage: z.number().nullable().transform(val => val ?? null),
  customersPerDay: z.number().nullable().transform(val => val ?? null),
  topServices: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  hasSeasonal: z.boolean(),
  seasonalDetails: z.string().optional(),
  peakHours: z.record(z.array(z.object({
    start: z.string(),
    end: z.string(),
    estimatedCustomers: z.number()
  })))
});

export default function BusinessHours({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [selectedHolidays, setSelectedHolidays] = useState<Array<{ id: string; date: Date; name: string }>>([]);
  
  const form = useForm<z.infer<typeof businessHoursSchema>>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: {
      businessHours: {
        monday: { open: '09:00', close: '18:00', enabled: true, breaks: [] },
        tuesday: { open: '09:00', close: '18:00', enabled: true, breaks: [] },
        wednesday: { open: '09:00', close: '18:00', enabled: true, breaks: [] },
        thursday: { open: '09:00', close: '18:00', enabled: true, breaks: [] },
        friday: { open: '09:00', close: '18:00', enabled: true, breaks: [] },
        saturday: { open: '09:00', close: '13:00', enabled: true, breaks: [] },
        sunday: { open: '09:00', close: '13:00', enabled: false, breaks: [] }
      },
      averageVisitDuration: 30,
      holidays: [],
      ticketAverage: null,
      customersPerDay: null,
      topServices: [],
      hasSeasonal: false,
      peakHours: {}
    },
  });

  const handleDayGroupSelect = useCallback((days: string[]) => {
    const currentValues = form.getValues().businessHours;
    const updatedHours = { ...currentValues };
    setExpandedDay(null);

    days.forEach(day => {
      updatedHours[day].enabled = true;
    });

    DAYS_OF_WEEK.forEach(day => {
      if (!days.includes(day)) {
        updatedHours[day].enabled = false;
      }
    });

    form.setValue('businessHours', updatedHours);
  }, [form]);

  const addNationalHolidays = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const newHolidays = NATIONAL_HOLIDAYS.map(holiday => {
      const [month, day] = holiday.date.split('-');
      const date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
      return { 
        id: `${holiday.date}-${holiday.name.toLowerCase().replace(/\s+/g, '-')}`,
        date, 
        name: holiday.name 
      };
    });

    // Filter out already selected holidays
    const currentHolidayIds = selectedHolidays.map(h => h.id);
    const uniqueNewHolidays = newHolidays.filter(
      h => !currentHolidayIds.includes(h.id)
    );

    setSelectedHolidays(prev => [...prev, ...uniqueNewHolidays]);
    form.setValue('holidays', [...(form.getValues().holidays || []), ...uniqueNewHolidays.map(h => h.date)]);
  }, [form]);

  const removeHoliday = useCallback((holidayId: string) => {
    setSelectedHolidays(prev => 
      prev.filter(h => h.id !== holidayId)
    );
    const holidayToRemove = selectedHolidays.find(h => h.id === holidayId)?.date;
    if (holidayToRemove) {
    form.setValue(
      'holidays',
      form.getValues().holidays.filter(
        h => h.toISOString() !== holidayToRemove.toISOString()
      )
    );
    }
  }, [form, selectedHolidays]);

  async function onSubmit(values: z.infer<typeof businessHoursSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-white shadow-lg border-0">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#063E65] to-[#1F9AF3]">
          <CardTitle className="text-white">Horários de Funcionamento</CardTitle>
          <CardDescription className="text-gray-100">
            Configure os horários de funcionamento da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Horário de Funcionamento</h3>
                  
                  <div className="flex gap-4 mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDayGroupSelect(WEEKDAYS)}
                    >
                      Dias Úteis
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDayGroupSelect(WEEKEND)}
                    >
                      Fim de Semana
                    </Button>
                  </div>

                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <React.Fragment key={day}>
                      <FormField
                        control={form.control}
                        name={`businessHours.${day}.enabled` as any}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <ToggleGroup
                                  type="single"
                                  value={expandedDay === day ? day : undefined}
                                  onValueChange={(value) => setExpandedDay(value === expandedDay ? null : value)}
                                >
                                  <div className="flex items-center">
                                    <Toggle
                                      pressed={field.value}
                                      onPressedChange={(pressed) => {
                                        field.onChange(pressed);
                                        if (!pressed) {
                                          setExpandedDay(null);
                                        }
                                      }}
                                      className={cn(
                                        'transition-all duration-200 w-full justify-start',
                                        field.value && 'bg-primary text-primary-foreground',
                                        'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
                                        'hover:bg-primary/90 hover:text-primary-foreground'
                                      )}
                                    >
                                      {DAY_LABELS[day]}
                                    </Toggle>
                                    {field.value && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="ml-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedDay(expandedDay === day ? null : day);
                                        }}
                                      >
                                        {expandedDay === day ? 'Fechar' : 'Configurar'}
                                      </Button>
                                    )}
                                  </div>
                                </ToggleGroup>
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      {expandedDay === day && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FormField
                            control={form.control}
                            name={`businessHours.${day}` as any}
                            render={({ field }) => (
                              <DaySchedule
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </motion.div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <h3 className="text-lg font-medium text-gray-900">Duração Média da Visita</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="averageVisitDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex gap-2 mb-4">
                              {VISIT_DURATION_PRESETS.map(preset => (
                                <Button
                                  key={preset.value}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => field.onChange(preset.value)}
                                  className={field.value === preset.value ? 'bg-primary text-primary-foreground' : ''}
                                >
                                  {preset.label}
                                </Button>
                              ))}
                            </div>
                            <Slider
                              min={5}
                              max={240}
                              step={5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full mt-6"
                            />
                            <div className="flex items-center justify-between">
                              <Input
                                type="number"
                                className="w-24 text-right"
                                value={field.value}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  if (value >= 5 && value <= 240) {
                                    field.onChange(value);
                                  }
                                }}
                                min={5}
                                max={240}
                                step={5}
                              />
                              <span className="text-sm text-gray-600 ml-2">minutos</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      <h3 className="text-lg font-medium text-gray-900">Feriados</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addNationalHolidays}
                    >
                      Adicionar Feriados Nacionais
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="holidays"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                field.value?.length > 0 && "border-primary text-primary"
                              )}
                            >
                              <CalendarDays className="mr-2 h-4 w-4" />
                              {field.value?.length > 0
                                ? "Clique para gerenciar feriados"
                                : "Selecione os feriados"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-4" align="start">
                            <div className="space-y-4">
                              <Calendar
                                mode="multiple"
                                selected={field.value}
                                onSelect={field.onChange}
                                className="rounded-md border"
                              />
                              {selectedHolidays.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <h4 className="font-medium text-sm">Feriados Selecionados:</h4>
                                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                                    {selectedHolidays.map((holiday) => (
                                      <div
                                        key={holiday.id}
                                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                      >
                                        <span className="text-sm">
                                          {holiday.name} - {holiday.date.toLocaleDateString('pt-BR')}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeHoliday(holiday.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <h3 className="text-lg font-medium text-gray-900">Informações Financeiras</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ticketAverage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Médio por Cliente (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              placeholder="Digite o valor"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? null : Number(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customersPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clientes por Dia (média)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Digite o valor"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? null : Number(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <h3 className="text-lg font-medium text-gray-900">Serviços e Sazonalidade</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="topServices"
                    render={() => (
                      <FormItem>
                        <FormLabel>Serviços Mais Procurados</FormLabel>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {COMMON_SERVICES.map((service) => (
                            <FormField
                              key={service}
                              control={form.control}
                              name="topServices"
                              render={({ field }) => (
                                <FormItem
                                  key={service}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(service)}
                                      onCheckedChange={(checked) => {
                                        const updated = checked
                                          ? [...field.value, service]
                                          : field.value?.filter((value) => value !== service);
                                        field.onChange(updated);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {service}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasSeasonal"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Existe sazonalidade no negócio?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'true')}
                            defaultValue={field.value ? 'true' : 'false'}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sim
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Não
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('hasSeasonal') && (
                    <FormField
                      control={form.control}
                      name="seasonalDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detalhes da Sazonalidade</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva os períodos de alta e baixa demanda..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <h3 className="text-lg font-medium text-gray-900">Horários de Pico</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Clique nas células para marcar os horários de maior movimento. Os horários marcados indicam períodos de alta demanda.
                  </p>

                  <WeeklySchedule
                    data={form.watch('peakHours')}
                    onCellClick={(day, hour) => {
                      const currentPeakHours = form.getValues().peakHours || {};
                      const dayPeakHours = currentPeakHours[day] || [];
                      
                      const hourExists = dayPeakHours.some(
                        peak => peak.start === `${hour}:00` && peak.end === `${hour + 1}:00`
                      );

                      const updatedPeakHours = hourExists
                        ? dayPeakHours.filter(
                            peak => !(peak.start === `${hour}:00` && peak.end === `${hour + 1}:00`)
                          )
                        : [
                            ...dayPeakHours,
                            {
                              start: `${hour}:00`,
                              end: `${hour + 1}:00`,
                              estimatedCustomers: Math.round(form.getValues().customersPerDay / 8)
                            }
                          ];

                      form.setValue('peakHours', {
                        ...currentPeakHours,
                        [day]: updatedPeakHours
                      });
                    }}
                    cellComponent={({ data }) => (
                      <div
                        className={`w-full h-full ${
                          data ? 'bg-primary/20 hover:bg-primary/30' : 'hover:bg-gray-100'
                        }`}
                      />
                    )}
                  />
                </div>
              </motion.div>
              
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#063E65] to-[#1F9AF3]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}