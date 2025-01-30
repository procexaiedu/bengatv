import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
  MessageSquare,
  Fingerprint,
  Award,
  HelpCircle,
  Plus,
  X
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const brandPersonalitySchema = z.object({
  companyValues: z.array(z.object({
    value: z.string().min(2, 'O valor deve ter pelo menos 2 caracteres'),
    description: z.string().min(20, 'A descrição deve ter pelo menos 20 caracteres').max(200, 'A descrição deve ter no máximo 200 caracteres')
  })).min(3, 'Adicione pelo menos 3 valores'),
  communicationStyle: z.string()
    .min(50, 'Descreva o estilo em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  identityElements: z.array(z.object({
    element: z.string().min(2, 'O elemento deve ter pelo menos 2 caracteres'),
    importance: z.string().min(20, 'A importância deve ter pelo menos 20 caracteres').max(200, 'A importância deve ter no máximo 200 caracteres')
  })).min(2, 'Adicione pelo menos 2 elementos'),
  serviceExcellence: z.string()
    .min(50, 'Descreva os diferenciais em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
});

export default function BrandPersonality({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newValue, setNewValue] = useState({ value: '', description: '' });
  const [newElement, setNewElement] = useState({ element: '', importance: '' });
  
  const form = useForm<z.infer<typeof brandPersonalitySchema>>({
    resolver: zodResolver(brandPersonalitySchema),
    defaultValues: {
      companyValues: [],
      communicationStyle: '',
      identityElements: [],
      serviceExcellence: '',
    },
  });

  const watchValues = form.watch('companyValues');
  const watchElements = form.watch('identityElements');

  const handleAddValue = () => {
    if (newValue.value.trim() && newValue.description.trim()) {
      form.setValue('companyValues', [...watchValues, {
        value: newValue.value.trim(),
        description: newValue.description.trim()
      }]);
      setNewValue({ value: '', description: '' });
      toast.success('Valor adicionado com sucesso!');
    }
  };

  const handleRemoveValue = (index: number) => {
    form.setValue('companyValues', watchValues.filter((_, i) => i !== index));
    toast.success('Valor removido com sucesso!');
  };

  const handleAddElement = () => {
    if (newElement.element.trim() && newElement.importance.trim()) {
      form.setValue('identityElements', [...watchElements, {
        element: newElement.element.trim(),
        importance: newElement.importance.trim()
      }]);
      setNewElement({ element: '', importance: '' });
      toast.success('Elemento adicionado com sucesso!');
    }
  };

  const handleRemoveElement = (index: number) => {
    form.setValue('identityElements', watchElements.filter((_, i) => i !== index));
    toast.success('Elemento removido com sucesso!');
  };

  async function onSubmit(values: z.infer<typeof brandPersonalitySchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Personalidade da marca salva com sucesso!");
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
          <CardTitle className="text-white">Personalidade da Marca</CardTitle>
          <CardDescription className="text-gray-100">
            Configure os valores, comunicação e elementos de identidade da sua marca
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
                {/* Company Values */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Valores da Empresa</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Adicione os principais valores da sua empresa</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Digite um valor (ex: Excelência)"
                        value={newValue.value}
                        onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
                      />
                      <Input
                        placeholder="Descreva o valor"
                        value={newValue.description}
                        onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddValue}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Valor
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {watchValues.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">{value.value}</h4>
                          <p className="text-sm text-gray-600">{value.description}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveValue(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="companyValues"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Communication Style */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Estilo de Comunicação</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva como sua marca se comunica</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="communicationStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Nossa marca se comunica de forma clara e objetiva, sempre mantendo um tom profissional mas acolhedor. Utilizamos linguagem técnica quando necessário, mas sempre explicamos os termos de forma acessível..."
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

                {/* Identity Elements */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Elementos de Identidade</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Adicione elementos que compõem a identidade da marca</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Digite um elemento (ex: Logo)"
                        value={newElement.element}
                        onChange={(e) => setNewElement({ ...newElement, element: e.target.value })}
                      />
                      <Input
                        placeholder="Descreva sua importância"
                        value={newElement.importance}
                        onChange={(e) => setNewElement({ ...newElement, importance: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddElement}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Elemento
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {watchElements.map((element, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-gray-900">{element.element}</h4>
                          <p className="text-sm text-gray-600">{element.importance}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveElement(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="identityElements"
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service Excellence */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Diferenciais no Atendimento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva os diferenciais no atendimento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="serviceExcellence"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Nossa empresa se destaca pelo atendimento personalizado, com profissionais altamente qualificados e dedicados. Oferecemos suporte técnico especializado, acompanhamento pós-serviço e garantia estendida..."
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