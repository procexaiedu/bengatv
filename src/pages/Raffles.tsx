import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ticket,
  Target,
  Megaphone,
  Users,
  HelpCircle,
  DollarSign,
  Building2,
  BarChart3,
  Users2,
  UserPlus
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const rafflesSchema = z.object({
  frequency: z.string()
    .min(1, 'A frequência das rifas é obrigatória'),
  customFrequency: z.string()
    .optional()
    .refine(val => !val || val.length >= 3, 'Especifique a frequência em pelo menos 3 caracteres'),
  objective: z.string()
    .min(1, 'O objetivo principal é obrigatório'),
  promotionDetails: z.string()
    .min(50, 'Descreva a divulgação em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  participationProcess: z.string()
    .min(50, 'Descreva o processo em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  averageRevenue: z.number()
    .min(0, 'O valor deve ser maior ou igual a zero')
    .max(1000000, 'O valor deve ser menor que 1.000.000'),
  averageCost: z.number()
    .min(0, 'O valor deve ser maior ou igual a zero')
    .max(1000000, 'O valor deve ser menor que 1.000.000'),
  averageProfit: z.number()
    .min(0, 'O valor deve ser maior ou igual a zero')
    .max(1000000, 'O valor deve ser menor que 1.000.000'),
  platforms: z.string()
    .min(3, 'Informe pelo menos uma plataforma')
    .max(500, 'O texto deve ter no máximo 500 caracteres'),
  hasPartnerships: z.enum(['sim', 'nao'], {
    required_error: 'Informe se há parcerias',
  }),
  partnershipDetails: z.string()
    .optional()
    .refine(val => !val || val.length >= 50, 'Descreva as parcerias em pelo menos 50 caracteres')
    .refine(val => !val || val.length <= 1000, 'A descrição deve ter no máximo 1000 caracteres'),
  averageEngagement: z.string()
    .min(50, 'Descreva o engajamento em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  averageLeads: z.number()
    .min(0, 'O número deve ser maior ou igual a zero')
    .max(10000, 'O número deve ser menor que 10.000'),
  averageTicket: z.number()
    .min(0, 'O valor deve ser maior ou igual a zero')
    .max(10000, 'O valor deve ser menor que 10.000'),
});

const frequencyOptions = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'quinzenal', label: 'Quinzenal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'bimestral', label: 'Bimestral' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'outro', label: 'Outro' },
];

const objectiveOptions = [
  { value: 'engajamento', label: 'Engajamento' },
  { value: 'leads', label: 'Geração de Leads' },
  { value: 'vendas', label: 'Vendas' },
  { value: 'branding', label: 'Branding' },
  { value: 'fidelizacao', label: 'Fidelização' },
];

export default function Raffles({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof rafflesSchema>>({
    resolver: zodResolver(rafflesSchema),
    defaultValues: {
      frequency: '',
      customFrequency: '',
      objective: '',
      promotionDetails: '',
      participationProcess: '',
      averageRevenue: 0,
      averageCost: 0,
      averageProfit: 0,
      platforms: '',
      hasPartnerships: 'nao',
      partnershipDetails: '',
      averageEngagement: '',
      averageLeads: 0,
      averageTicket: 0,
    },
  });

  const watchFrequency = form.watch('frequency');
  const watchHasPartnerships = form.watch('hasPartnerships');

  // Calculate profit automatically when revenue or cost changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'averageRevenue' || name === 'averageCost') {
        const revenue = form.getValues('averageRevenue') || 0;
        const cost = form.getValues('averageCost') || 0;
        form.setValue('averageProfit', revenue - cost);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof rafflesSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Informações sobre rifas salvas com sucesso!");
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
          <CardTitle className="text-white">Rifas</CardTitle>
          <CardDescription className="text-gray-100">
            Configure as informações sobre as rifas realizadas
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
                {/* Frequency */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Frequência das Rifas</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Com que frequência as rifas são realizadas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual a frequência de realização das rifas?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AnimatePresence>
                    {watchFrequency === 'outro' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="customFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Especifique a Frequência</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: A cada 45 dias" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Objective */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Objetivo Principal</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Principal objetivo da realização das rifas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual o objetivo principal das rifas?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o objetivo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {objectiveOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Promotion Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Divulgação</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Como as rifas são divulgadas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="promotionDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Como as rifas são divulgadas?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os canais e estratégias de divulgação"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Participation Process */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Processo de Participação</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Como os participantes podem participar das rifas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="participationProcess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Como funciona o processo de participação?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o passo a passo para participar"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Informações Financeiras</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Dados financeiros das rifas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="averageRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Arrecadado (Média)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                R$
                              </span>
                              <Input
                                type="number"
                                className="pl-8"
                                placeholder="0,00"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custo Médio</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                R$
                              </span>
                              <Input
                                type="number"
                                className="pl-8"
                                placeholder="0,00"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageProfit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lucro Médio</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                R$
                              </span>
                              <Input
                                type="number"
                                className="pl-8"
                                placeholder="0,00"
                                {...field}
                                disabled
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Platforms */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Plataformas</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Plataformas utilizadas para realizar as rifas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="platforms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais plataformas são utilizadas?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Instagram, Facebook, Rifa.link, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Partnerships */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Parcerias</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Parcerias com outras empresas para realização das rifas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="hasPartnerships"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>As rifas são realizadas em parceria com outras empresas?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="sim" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sim
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="nao" />
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
                  <AnimatePresence>
                    {watchHasPartnerships === 'sim' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="partnershipDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detalhe as parcerias</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva as empresas parceiras e como funciona a parceria"
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Engagement */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Engajamento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Métricas de engajamento das rifas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="averageEngagement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual o engajamento médio por rifa?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva métricas como visualizações, compartilhamentos, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Leads and Ticket */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Leads e Ticket Médio</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Informações sobre geração de leads e ticket médio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="averageLeads"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Média de Novos Leads por Rifa</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageTicket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Médio por Rifa</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                R$
                              </span>
                              <Input
                                type="number"
                                className="pl-8"
                                placeholder="0,00"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                  className={`
                    bg-gradient-to-r from-[#063E65] to-[#1F9AF3]
                    transition-all duration-200
                    hover:shadow-lg hover:scale-105
                    ${!form.formState.isValid ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
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