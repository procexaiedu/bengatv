import React, { useState } from 'react';
import { examples } from '@/lib/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MessageSquare, Hand, Bell, ChevronLeft, Loader2, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const standardResponsesSchema = z.object({
  initialGreeting: z.string()
    .min(10, 'A saudação inicial deve ter pelo menos 10 caracteres')
    .max(500, 'A saudação inicial deve ter no máximo 500 caracteres')
    .refine(val => val.includes('olá') || val.includes('Olá'), {
      message: 'A saudação inicial deve incluir "olá" ou "Olá"'
    }),
  farewell: z.string()
    .min(10, 'A despedida deve ter pelo menos 10 caracteres')
    .max(500, 'A despedida deve ter no máximo 500 caracteres'),
  appointmentConfirmation: z.string()
    .min(10, 'A confirmação de agendamento deve ter pelo menos 10 caracteres')
    .max(500, 'A confirmação de agendamento deve ter no máximo 500 caracteres')
    .refine(val => val.match(/\d{2}\/\d{2}\/\d{4}/) || val.match(/\d{2}:\d{2}/), {
      message: 'Deve incluir data (DD/MM/AAAA) e horário (HH:MM)'
    }),
  visitReminders: z.string()
    .min(10, 'Os lembretes de visita devem ter pelo menos 10 caracteres')
    .max(500, 'Os lembretes de visita devem ter no máximo 500 caracteres')
    .refine(val => !val.match(/https?:\/\/[^\s]+/), {
      message: 'Não inclua URLs - use o campo específico para links'
    }),
  websiteUrl: z.string()
    .url('Insira uma URL válida')
    .optional(),
  contactPhone: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'Insira um número de telefone válido')
    .optional()
});

export default function StandardResponses({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof standardResponsesSchema>>({
    resolver: zodResolver(standardResponsesSchema),
    defaultValues: {
      initialGreeting: '',
      farewell: '',
      appointmentConfirmation: '',
      visitReminders: '',
    },
  });

  async function onSubmit(values: z.infer<typeof standardResponsesSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Respostas padrão salvas com sucesso!");
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Ocorreu um erro ao salvar as informações.");
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
          <CardTitle className="text-white">Respostas Padrão</CardTitle>
          <CardDescription className="text-gray-100">
            Configure as respostas padrão para interações com os clientes
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
                {/* Initial Greeting */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Saudação Inicial</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mensagem de saudação para os clientes.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="initialGreeting"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              placeholder="Ex: Olá! Bem-vindo à nossa loja. Como posso ajudar você hoje?"
                              className="pr-16"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value?.length || 0}/500
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Farewell */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hand className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-gray-900">Despedida</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Hand className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mensagem de despedida para os clientes.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormField
                    control={form.control}
                    name="farewell"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ex: Obrigado por nos visitar! Tenha um ótimo dia!"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Appointment Confirmation */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium text-gray-900">Confirmação de Agendamento</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Bell className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mensagem de confirmação de agendamento.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormField
                    control={form.control}
                    name="appointmentConfirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ex: Seu agendamento foi confirmado para o dia XX às XX horas."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Visit Reminders */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Lembretes de Visita</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mensagem de lembrete para os clientes sobre a visita.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="visitReminders"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Ex: Lembre-se de trazer os documentos necessários para a sua visita."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
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
                  className="bg-gradient-to-r from-[#063E65] to-[#1F9AF3] transition-all duration-200 hover:shadow-lg hover:scale-105"
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
