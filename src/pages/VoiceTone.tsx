import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Wrench,
  XCircle,
  Sparkles,
  HelpCircle
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const voiceToneSchema = z.object({
  tone: z.enum(['formal', 'informal', 'friendly', 'technical'], {
    required_error: 'Selecione o tom de voz'
  }),
  useTechnicalJargon: z.boolean(),
  sectorTerms: z.string()
    .min(50, 'Descreva os termos em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  expressionsToAvoid: z.string()
    .min(50, 'Descreva as expressões em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  brandPersonality: z.string()
    .min(50, 'Descreva a personalidade em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
});

const toneOptions = [
  { value: 'formal', label: 'Formal', description: 'Comunicação profissional e estruturada' },
  { value: 'informal', label: 'Informal', description: 'Comunicação descontraída e casual' },
  { value: 'friendly', label: 'Amigável', description: 'Comunicação próxima e acolhedora' },
  { value: 'technical', label: 'Técnico', description: 'Comunicação focada em aspectos técnicos' }
] as const;

export default function VoiceTone({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof voiceToneSchema>>({
    resolver: zodResolver(voiceToneSchema),
    defaultValues: {
      tone: undefined,
      useTechnicalJargon: false,
      sectorTerms: '',
      expressionsToAvoid: '',
      brandPersonality: '',
    },
  });

  async function onSubmit(values: z.infer<typeof voiceToneSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Tom de voz configurado com sucesso!");
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
          <CardTitle className="text-white">Tom de Voz</CardTitle>
          <CardDescription className="text-gray-100">
            Configure como o chatbot deve se comunicar com os clientes
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
                {/* Voice Tone */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Tom de Voz</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione o tom de voz para comunicação</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tom de voz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {toneOptions.map(tone => (
                              <SelectItem key={tone.value} value={tone.value}>
                                <div className="flex flex-col">
                                  <span>{tone.label}</span>
                                  <span className="text-xs text-gray-500">{tone.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Technical Jargon */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Uso de Termos Técnicos</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Defina se o chatbot deve usar termos técnicos</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="useTechnicalJargon"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
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
                                Sim, usar termos técnicos
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Não, usar linguagem simples
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sector Terms */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Termos do Setor</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Liste os termos específicos do setor</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="sectorTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Termos a serem utilizados: 'Remapeamento', 'Downpipe', 'ECU'. Termos a serem evitados: 'Gambiarra', 'Xuning', etc."
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

                {/* Expressions to Avoid */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Expressões a Evitar</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Liste as expressões que devem ser evitadas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="expressionsToAvoid"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: 'Não sei', 'Espere um pouco', 'Calma', etc."
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

                {/* Brand Personality */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Personalidade da Marca</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva a personalidade da sua marca</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="brandPersonality"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Nossa marca se comunica de forma descontraída e amigável, com foco em performance e tecnologia."
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