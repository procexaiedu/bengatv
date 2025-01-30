import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Target,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

// Common questions and objections for automotive services
const COMMON_QUESTIONS = [
  { id: 'q1', text: 'Qual o tempo médio de serviço?' },
  { id: 'q2', text: 'Qual o valor do investimento?' },
  { id: 'q3', text: 'Quais as formas de pagamento?' },
  { id: 'q4', text: 'Há garantia no serviço?' },
  { id: 'q5', text: 'O carro perde a garantia de fábrica?' },
  { id: 'q6', text: 'Posso acompanhar o serviço?' },
  { id: 'q7', text: 'Vocês fornecem laudo técnico?' },
  { id: 'q8', text: 'Qual a durabilidade das modificações?' }
];

const COMMON_OBJECTIONS = [
  { id: 'o1', text: 'Preço elevado' },
  { id: 'o2', text: 'Perda da garantia do veículo' },
  { id: 'o3', text: 'Receio de problemas futuros' },
  { id: 'o4', text: 'Dúvidas sobre a qualidade' },
  { id: 'o5', text: 'Tempo de execução longo' },
  { id: 'o6', text: 'Falta de referências' },
  { id: 'o7', text: 'Concorrentes mais baratos' },
  { id: 'o8', text: 'Insegurança sobre modificações' }
];

const targetAudienceSchema = z.object({
  typicalProfile: z.string()
    .min(50, 'Descreva o perfil em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  mainDemands: z.string()
    .min(50, 'Descreva as demandas em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  commonQuestions: z.array(z.string())
    .min(1, 'Selecione pelo menos uma dúvida comum'),
  questionAnswers: z.record(z.string(), z.string()
    .min(20, 'A resposta deve ter pelo menos 20 caracteres')
    .max(500, 'A resposta deve ter no máximo 500 caracteres')),
  otherQuestions: z.array(z.string())
    .optional(),
  otherQuestionAnswers: z.record(z.string(), z.string()
    .min(20, 'A resposta deve ter pelo menos 20 caracteres')
    .max(500, 'A resposta deve ter no máximo 500 caracteres'))
    .optional(),
  commonObjections: z.array(z.string())
    .min(1, 'Selecione pelo menos uma objeção comum'),
  objectionStrategies: z.record(z.string(), z.string()
    .min(20, 'A estratégia deve ter pelo menos 20 caracteres')
    .max(500, 'A estratégia deve ter no máximo 500 caracteres')),
  otherObjections: z.array(z.string())
    .optional(),
  otherObjectionStrategies: z.record(z.string(), z.string()
    .min(20, 'A estratégia deve ter pelo menos 20 caracteres')
    .max(500, 'A estratégia deve ter no máximo 500 caracteres'))
    .optional(),
});

export default function TargetAudience({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newObjection, setNewObjection] = useState('');
  
  const form = useForm<z.infer<typeof targetAudienceSchema>>({
    resolver: zodResolver(targetAudienceSchema),
    defaultValues: {
      typicalProfile: '',
      mainDemands: '',
      commonQuestions: [],
      questionAnswers: {},
      otherQuestions: [],
      otherQuestionAnswers: {},
      commonObjections: [],
      objectionStrategies: {},
      otherObjections: [],
      otherObjectionStrategies: {},
    },
  });

  const watchCommonQuestions = form.watch('commonQuestions');
  const watchOtherQuestions = form.watch('otherQuestions') || [];
  const watchCommonObjections = form.watch('commonObjections');
  const watchOtherObjections = form.watch('otherObjections') || [];

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      form.setValue('otherQuestions', [...watchOtherQuestions, newQuestion.trim()]);
      form.setValue('otherQuestionAnswers', {
        ...form.getValues('otherQuestionAnswers'),
        [newQuestion.trim()]: ''
      });
      setNewQuestion('');
      toast.success('Dúvida adicionada com sucesso!');
    }
  };

  const handleRemoveQuestion = (question: string) => {
    form.setValue('otherQuestions', watchOtherQuestions.filter(q => q !== question));
    const answers = { ...form.getValues('otherQuestionAnswers') };
    delete answers[question];
    form.setValue('otherQuestionAnswers', answers);
    toast.success('Dúvida removida com sucesso!');
  };

  const handleAddObjection = () => {
    if (newObjection.trim()) {
      form.setValue('otherObjections', [...watchOtherObjections, newObjection.trim()]);
      form.setValue('otherObjectionStrategies', {
        ...form.getValues('otherObjectionStrategies'),
        [newObjection.trim()]: ''
      });
      setNewObjection('');
      toast.success('Objeção adicionada com sucesso!');
    }
  };

  const handleRemoveObjection = (objection: string) => {
    form.setValue('otherObjections', watchOtherObjections.filter(o => o !== objection));
    const strategies = { ...form.getValues('otherObjectionStrategies') };
    delete strategies[objection];
    form.setValue('otherObjectionStrategies', strategies);
    toast.success('Objeção removida com sucesso!');
  };

  async function onSubmit(values: z.infer<typeof targetAudienceSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Informações do público-alvo salvas com sucesso!");
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
          <CardTitle className="text-white">Público-Alvo</CardTitle>
          <CardDescription className="text-gray-100">
            Defina o perfil do seu público-alvo e suas principais características
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
                {/* Typical Profile */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Perfil Típico dos Clientes</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva o perfil do seu cliente ideal</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="typicalProfile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Homens e mulheres de 25 a 45 anos, apaixonados por carros, que buscam performance e personalização, com renda média a alta..."
                              maxLength={1000}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value.length}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Main Demands */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Principais Demandas</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Liste as principais necessidades dos seus clientes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="mainDemands"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Aumento de potência, melhoria da suspensão, personalização da estética, segurança..."
                              maxLength={1000}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value.length}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Common Questions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Dúvidas Mais Frequentes</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione as dúvidas mais comuns dos clientes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="commonQuestions"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {COMMON_QUESTIONS.map((question) => (
                            <FormField
                              key={question.id}
                              control={form.control}
                              name="commonQuestions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={question.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(question.text)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, question.text])
                                            : (() => {
                                              const newValue = field.value.filter(
                                                   (value) => value !== question.text
                                              );
                                              field.onChange(newValue);
                                              const answers = { ...form.getValues('questionAnswers') };
                                              if (!checked) delete answers[question.text];
                                              form.setValue('questionAnswers', answers);
                                              return newValue;
                                            })()
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {question.text}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Question Answers */}
                  <div className="space-y-4 mt-4">
                    {watchCommonQuestions.map((question) => (
                      <FormField
                        key={question}
                        control={form.control}
                        name={`questionAnswers.${question}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Resposta para: {question}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  {...field}
                                  className="min-h-[100px] resize-none"
                                  placeholder="Digite a resposta padrão para esta dúvida..."
                                  maxLength={500}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                  {(field.value?.length || 0)}/500
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Other Question Answers */}
                  {watchOtherQuestions.map((question) => (
                    <FormField
                      key={question}
                      control={form.control}
                      name={`otherQuestionAnswers.${question}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Resposta para: {question}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                className="min-h-[100px] resize-none"
                                placeholder="Digite a resposta padrão para esta dúvida..."
                                maxLength={500}
                              />
                              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                {(field.value?.length || 0)}/500
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite uma nova dúvida frequente"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddQuestion}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchOtherQuestions.map((question) => (
                        <Badge
                          key={question}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {question}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveQuestion(question)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Common Objections */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Objeções Comuns</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione as objeções mais comuns dos clientes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="commonObjections"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {COMMON_OBJECTIONS.map((objection) => (
                            <FormField
                              key={objection.id}
                              control={form.control}
                              name="commonObjections"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={objection.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(objection.text)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, objection.text])
                                            : (() => {
                                              const newValue = field.value.filter(
                                                   (value) => value !== objection.text
                                              );
                                              field.onChange(newValue);
                                              const strategies = { ...form.getValues('objectionStrategies') };
                                              if (!checked) delete strategies[objection.text];
                                              form.setValue('objectionStrategies', strategies);
                                              return newValue;
                                            })()
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {objection.text}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Objection Strategies */}
                  <div className="space-y-4 mt-4">
                    {watchCommonObjections.map((objection) => (
                      <FormField
                        key={objection}
                        control={form.control}
                        name={`objectionStrategies.${objection}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Como lidar com: {objection}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  {...field}
                                  className="min-h-[100px] resize-none"
                                  placeholder="Descreva a estratégia para lidar com esta objeção..."
                                  maxLength={500}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                  {(field.value?.length || 0)}/500
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Other Objection Strategies */}
                  {watchOtherObjections.map((objection) => (
                    <FormField
                      key={objection}
                      control={form.control}
                      name={`otherObjectionStrategies.${objection}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">Como lidar com: {objection}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                className="min-h-[100px] resize-none"
                                placeholder="Descreva a estratégia para lidar com esta objeção..."
                                maxLength={500}
                              />
                              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                {(field.value?.length || 0)}/500
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite uma nova objeção comum"
                        value={newObjection}
                        onChange={(e) => setNewObjection(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddObjection}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchOtherObjections.map((objection) => (
                        <Badge
                          key={objection}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {objection}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveObjection(objection)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
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