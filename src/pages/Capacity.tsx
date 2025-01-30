import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  Users,
  Clock,
  LayoutGrid
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CapacityChart } from "@/components/business/CapacityChart";

const capacitySchema = z.object({
  maxDailyAppointments: z.number()
    .min(1, 'Deve haver pelo menos 1 agendamento por dia')
    .max(1000, 'O número máximo de agendamentos por dia não pode exceder 1000')
    .refine((val) => val >= 0, 'O número de agendamentos deve ser positivo'),
  maxSimultaneousAppointments: z.number()
    .min(1, 'Deve haver pelo menos 1 agendamento simultâneo')
    .max(100, 'O número máximo de agendamentos simultâneos não pode exceder 100')
    .refine((val) => val >= 0, 'O número de agendamentos simultâneos deve ser positivo'),
  minAppointmentInterval: z.number()
    .min(5, 'O intervalo mínimo deve ser de 5 minutos')
    .max(120, 'O intervalo máximo deve ser de 120 minutos'),
  serviceBoxes: z.number()
    .min(1, 'Deve haver pelo menos 1 box de atendimento')
    .max(50, 'O número máximo de boxes não pode exceder 50'),
  // Hidden fields for calculations
  totalHoursPerDay: z.number().optional(),
  totalHoursPerWeek: z.number().optional(),
  averageAppointmentsPerHour: z.number().optional()
});

type FormData = z.infer<typeof capacitySchema>;

export default function Capacity({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(capacitySchema),
    defaultValues: {
      maxDailyAppointments: 20,
      maxSimultaneousAppointments: 5,
      minAppointmentInterval: 15,
      serviceBoxes: 3,
      totalHoursPerDay: 0,
      totalHoursPerWeek: 0,
      averageAppointmentsPerHour: 0
    },
  });

  // Watch form values for validation
  const maxDailyAppointments = useWatch({
    control: form.control,
    name: "maxDailyAppointments"
  });

  const maxSimultaneousAppointments = useWatch({
    control: form.control,
    name: "maxSimultaneousAppointments"
  });

  // Validate maxSimultaneousAppointments against maxDailyAppointments
  React.useEffect(() => {
    if (maxSimultaneousAppointments > maxDailyAppointments) {
      form.setError("maxSimultaneousAppointments", {
        type: "manual",
        message: "O número de agendamentos simultâneos não pode ser maior que o número máximo de agendamentos por dia"
      });
    } else {
      form.clearErrors("maxSimultaneousAppointments");
    }
  }, [maxSimultaneousAppointments, maxDailyAppointments, form]);

  // Validate serviceBoxes against maxSimultaneousAppointments
  React.useEffect(() => {
    const serviceBoxes = form.getValues("serviceBoxes");
    if (serviceBoxes > maxSimultaneousAppointments) {
      form.setError("serviceBoxes", {
        type: "manual",
        message: "O número de boxes não pode ser maior que o número máximo de agendamentos simultâneos"
      });
    } else {
      form.clearErrors("serviceBoxes");
    }
  }, [maxSimultaneousAppointments, form]);

  // Calculate hidden fields
  const calculateHiddenFields = React.useCallback(() => {
    // These são cálculos de exemplo - você deve integrar com os dados reais da subseção 1.2
    const hoursPerDay = 8; // Exemplo: 8 horas por dia
    const workingDays = 5; // Exemplo: 5 dias por semana
    
    const totalHoursPerDay = hoursPerDay;
    const totalHoursPerWeek = hoursPerDay * workingDays;
    const averageAppointmentsPerHour = maxDailyAppointments / hoursPerDay;

    form.setValue("totalHoursPerDay", totalHoursPerDay);
    form.setValue("totalHoursPerWeek", totalHoursPerWeek);
    form.setValue("averageAppointmentsPerHour", averageAppointmentsPerHour);
  }, [maxDailyAppointments, form]);

  // Update hidden fields when relevant values change
  React.useEffect(() => {
    calculateHiddenFields();
  }, [maxDailyAppointments, calculateHiddenFields]);

  async function onSubmit(values: z.infer<typeof capacitySchema>) {
    try {
      setIsSubmitting(true);
      
      // Validate before submission
      if (values.maxSimultaneousAppointments > values.maxDailyAppointments) {
        form.setError("maxSimultaneousAppointments", {
          type: "manual",
          message: "O número de agendamentos simultâneos não pode ser maior que o número máximo de agendamentos por dia"
        });
        return;
      }

      if (values.serviceBoxes > values.maxSimultaneousAppointments) {
        form.setError("serviceBoxes", {
          type: "manual",
          message: "O número de boxes não pode ser maior que o número máximo de agendamentos simultâneos"
        });
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate final values for hidden fields
      calculateHiddenFields();
      
      onNext(values);
      toast.success("Configurações de capacidade salvas com sucesso!");
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Ocorreu um erro ao salvar as configurações.");
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
          <CardTitle className="text-white">Capacidade de Atendimento</CardTitle>
          <CardDescription className="text-gray-100">
            Configure os limites e parâmetros de atendimento do seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Daily Appointments */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-gray-900">Agendamentos por Dia</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="maxDailyAppointments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número máximo de agendamentos por dia</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={1}
                              max={100}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-24"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1 && value <= 1000) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                              <span className="text-sm text-gray-600">agendamentos</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Simultaneous Appointments */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-gray-900">Agendamentos Simultâneos</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="maxSimultaneousAppointments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número máximo de agendamentos simultâneos</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={1}
                              max={20}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-24"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1 && value <= 100) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                              <span className="text-sm text-gray-600">agendamentos</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Appointment Interval */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-gray-900">Intervalo entre Agendamentos</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="minAppointmentInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo mínimo de intervalo entre agendamentos</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex gap-2 mb-4">
                              {[5, 10, 15, 30, 45, 60].map(minutes => (
                                <Button
                                  key={minutes}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => field.onChange(minutes)}
                                  className={field.value === minutes ? 'bg-primary text-primary-foreground' : ''}
                                >
                                  {minutes} min
                                </Button>
                              ))}
                            </div>
                            <Slider
                              min={5}
                              max={120}
                              step={5}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-24"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 5 && value <= 120) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                              <span className="text-sm text-gray-600">minutos</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service Boxes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-gray-900">Boxes de Atendimento</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="serviceBoxes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de boxes de atendimento</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                              min={1}
                              max={20}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-24"
                                {...field}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value >= 1 && value <= 50) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                              <span className="text-sm text-gray-600">boxes</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900">Visualização da Capacidade</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      O gráfico abaixo mostra a distribuição da capacidade de atendimento ao longo do dia,
                      considerando os horários de pico e a capacidade máxima configurada.
                    </p>
                    <CapacityChart
                      maxDailyAppointments={form.getValues("maxDailyAppointments")}
                      maxSimultaneousAppointments={form.getValues("maxSimultaneousAppointments")}
                      minAppointmentInterval={form.getValues("minAppointmentInterval")}
                    />
                  </div>
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