import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Youtube,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Share2,
  HelpCircle,
  LineChart,
  Megaphone,
  Users2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const contentProductionSchema = z.object({
  publishingFrequency: z.string()
    .min(1, 'A frequência de publicação é obrigatória')
    .max(100, 'A frequência de publicação deve ter no máximo 100 caracteres'),
  customPublishingFrequency: z.string().optional(),
  averageVideoDuration: z.string()
    .min(1, 'A duração média dos vídeos é obrigatória')
    .max(50, 'A duração média deve ter no máximo 50 caracteres'),
  contentResponsible: z.enum(['interno', 'terceirizado'], {
    required_error: 'Selecione o responsável pela produção de conteúdo',
  }),
  hasEditorialCalendar: z.enum(['sim', 'nao'], {
    required_error: 'Informe se existe um calendário editorial',
  }),
  monetizationStrategy: z.string()
    .min(50, 'Descreva a estratégia de monetização em pelo menos 50 caracteres')
    .max(1000, 'A descrição da monetização deve ter no máximo 1000 caracteres'),
  averageEngagement: z.string()
    .min(50, 'Descreva o engajamento médio em pelo menos 50 caracteres')
    .max(1000, 'A descrição do engajamento deve ter no máximo 1000 caracteres'),
  contentIntegration: z.string()
    .min(50, 'Descreva a integração do conteúdo em pelo menos 50 caracteres')
    .max(1000, 'A descrição da integração deve ter no máximo 1000 caracteres'),
  analyticsTools: z.string()
    .min(5, 'Informe pelo menos uma ferramenta de análise')
    .max(500, 'A descrição das ferramentas deve ter no máximo 500 caracteres'),
  hasPaidMedia: z.enum(['sim', 'nao'], {
    required_error: 'Informe se há investimento em mídia paga',
  }),
  paidMediaStrategy: z.string()
    .optional()
    .refine(val => !val || val.length >= 50, 'Descreva a estratégia em pelo menos 50 caracteres')
    .refine(val => !val || val.length <= 1000, 'A descrição deve ter no máximo 1000 caracteres'),
  hasInfluencerPartnerships: z.enum(['sim', 'nao'], {
    required_error: 'Informe se há parcerias com influenciadores',
  }),
  influencerPartnershipsDetails: z.string()
    .optional()
    .refine(val => !val || val.length >= 50, 'Descreva as parcerias em pelo menos 50 caracteres')
    .refine(val => !val || val.length <= 1000, 'A descrição deve ter no máximo 1000 caracteres'),
});

const publishingFrequencyOptions = [
  { value: 'diariamente', label: 'Diariamente' },
  { value: 'semanalmente', label: 'Semanalmente' },
  { value: 'quinzenalmente', label: 'Quinzenalmente' },
  { value: 'mensalmente', label: 'Mensalmente' },
  { value: 'outro', label: 'Outro' },
];

const videoDurationOptions = [
  { value: 'menos-5', label: 'Menos de 5 minutos' },
  { value: '5-10', label: 'Entre 5 e 10 minutos' },
  { value: '10-15', label: 'Entre 10 e 15 minutos' },
  { value: '15-30', label: 'Entre 15 e 30 minutos' },
  { value: 'mais-30', label: 'Mais de 30 minutos' },
];

export default function ContentProduction({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof contentProductionSchema>>({
    resolver: zodResolver(contentProductionSchema),
    defaultValues: {
      publishingFrequency: '',
      customPublishingFrequency: '',
      averageVideoDuration: '',
      contentResponsible: 'interno',
      hasEditorialCalendar: 'nao',
      monetizationStrategy: '',
      averageEngagement: '',
      contentIntegration: '',
      analyticsTools: '',
      hasPaidMedia: 'nao',
      paidMediaStrategy: '',
      hasInfluencerPartnerships: 'nao',
      influencerPartnershipsDetails: '',
    },
  });

  const watchPublishingFrequency = form.watch('publishingFrequency');
  const watchHasPaidMedia = form.watch('hasPaidMedia');
  const watchHasInfluencerPartnerships = form.watch('hasInfluencerPartnerships');

  async function onSubmit(values: z.infer<typeof contentProductionSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Informações de produção de conteúdo salvas com sucesso!");
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
          <CardTitle className="text-white">Produção de Conteúdo</CardTitle>
          <CardDescription className="text-gray-100">
            Configure as informações sobre a produção de conteúdo para redes sociais
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
                {/* Publishing Frequency */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Frequência de Publicação</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Defina com que frequência novos vídeos são publicados no canal</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="publishingFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequência de Publicação no YouTube</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a frequência" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {publishingFrequencyOptions.map(option => (
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
                  {watchPublishingFrequency === 'outro' && (
                    <FormField
                      control={form.control}
                      name="customPublishingFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique a Frequência</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ex: 3 vezes por mês" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Video Duration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Duração dos Vídeos</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Tempo médio de duração dos vídeos publicados</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="averageVideoDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qual o tempo médio de duração dos vídeos?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a duração média" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {videoDurationOptions.map(option => (
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

                {/* Content Responsible */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Responsável pelo Conteúdo</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Quem é responsável pela produção do conteúdo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="contentResponsible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quem é o responsável pela produção de conteúdo?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="interno">Interno</SelectItem>
                            <SelectItem value="terceirizado">Terceirizado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Editorial Calendar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Calendário Editorial</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Planejamento estruturado de publicações</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="hasEditorialCalendar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Existe um calendário editorial para o YouTube e Instagram?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sim">Sim</SelectItem>
                            <SelectItem value="nao">Não</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Monetization */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Estratégia de Monetização</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Como o conteúdo gera receita</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="monetizationStrategy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Como o conteúdo é monetizado?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva as formas de monetização (ex: anúncios, parcerias, etc.)"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Engagement */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Métricas de Engajamento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Desempenho médio dos vídeos publicados</p>
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
                        <FormLabel>Qual o engajamento médio dos vídeos?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva métricas como visualizações, curtidas, comentários, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Content Integration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Integração do Conteúdo</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Como o conteúdo digital se conecta com outros canais</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="contentIntegration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Como o conteúdo do YouTube/Instagram é integrado com a divulgação da loja física e das rifas?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva como é feita a integração entre os canais"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Analytics Tools */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Ferramentas de Análise</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ferramentas utilizadas para análise de métricas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="analyticsTools"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais ferramentas de análise são utilizadas?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: YouTube Analytics, Google Analytics, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Paid Media */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Mídia Paga</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Investimento em promoção paga de conteúdo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="hasPaidMedia"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Há investimento em mídia paga?</FormLabel>
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
                    {watchHasPaidMedia === 'sim' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="paidMediaStrategy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detalhe a estratégia de mídia paga</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva o orçamento mensal, plataformas utilizadas, etc."
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

                {/* Influencer Partnerships */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Parcerias com Influenciadores</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Colaborações com outros criadores de conteúdo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="hasInfluencerPartnerships"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Realiza parcerias com influenciadores digitais?</FormLabel>
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
                    {watchHasInfluencerPartnerships === 'sim' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormField
                          control={form.control}
                          name="influencerPartnershipsDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detalhe as parcerias com influenciadores</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva os tipos de parcerias, resultados obtidos, etc."
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