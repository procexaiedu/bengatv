import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Target,
  TrendingUp,
  Lightbulb,
  HelpCircle
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const objectivesSchema = z.object({
  currentChallenges: z.string()
    .min(50, 'Descreva os desafios em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  objectives: z.string()
    .min(50, 'Descreva os objetivos em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  roiExpectations: z.string()
    .min(50, 'Descreva as expectativas em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  specificProject: z.string()
    .min(50, 'Descreva o projeto em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
});

export default function Objectives({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof objectivesSchema>>({
    resolver: zodResolver(objectivesSchema),
    defaultValues: {
      currentChallenges: '',
      objectives: '',
      roiExpectations: '',
      specificProject: '',
    },
  });

  async function onSubmit(values: z.infer<typeof objectivesSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Objetivos salvos com sucesso!");
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
          <CardTitle className="text-white">Objetivos com a ProceX AI</CardTitle>
          <CardDescription className="text-gray-100">
            Compartilhe seus objetivos e expectativas com a ProceX AI
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
                {/* Current Challenges */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Desafios Atuais</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Principais desafios enfrentados atualmente</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="currentChallenges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais os principais desafios que a BengaTV enfrenta atualmente?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os principais desafios e dificuldades..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Objectives */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Objetivos</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Objetivos esperados com a contratação</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="objectives"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais os objetivos da BengaTV com a contratação da ProceX AI?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva os objetivos esperados..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ROI Expectations */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Expectativas de ROI</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Retorno esperado sobre o investimento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="roiExpectations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quais as expectativas de retorno sobre o investimento (ROI) com as soluções da ProceX AI?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva as expectativas de retorno..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Specific Project */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Projeto Específico</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Projetos específicos em mente</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="specificProject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Existe algum projeto específico em mente que a BengaTV gostaria de desenvolver com a ProceX AI?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva o projeto em mente..."
                            className="min-h-[120px] resize-none"
                            {...field}
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