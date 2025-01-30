import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ClipboardList,
  FileText,
  Ban,
  CalendarRange,
  Clock,
  HelpCircle,
  Plus,
  X
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { REQUIRED_INFORMATION, REQUIRED_DOCUMENTS, TIME_UNITS } from '@/lib/constants';

const schedulingProcessSchema = z.object({
  requiredInformation: z.array(z.string())
    .min(1, 'Selecione pelo menos uma informação necessária'),
  otherInformation: z.array(z.string())
    .optional(),
  requiredDocuments: z.array(z.string())
    .min(1, 'Selecione pelo menos um documento necessário'),
  otherDocuments: z.array(z.string())
    .optional(),
  cancellationPolicy: z.string()
    .min(50, 'Descreva a política em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  reschedulingPolicy: z.string()
    .min(50, 'Descreva a política em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  minimumAdvanceTime: z.object({
    scheduling: z.object({
      value: z.number().min(1, 'O valor deve ser maior que zero'),
      unit: z.enum(['hours', 'days', 'weeks'])
    }),
    cancellation: z.object({
      value: z.number().min(1, 'O valor deve ser maior que zero'),
      unit: z.enum(['hours', 'days', 'weeks'])
    }),
    rescheduling: z.object({
      value: z.number().min(1, 'O valor deve ser maior que zero'),
      unit: z.enum(['hours', 'days', 'weeks'])
    })
  })
});

export default function SchedulingProcess({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInfo, setNewInfo] = useState('');
  const [newDoc, setNewDoc] = useState('');
  
  const form = useForm<z.infer<typeof schedulingProcessSchema>>({
    resolver: zodResolver(schedulingProcessSchema),
    defaultValues: {
      requiredInformation: [],
      otherInformation: [],
      requiredDocuments: [],
      otherDocuments: [],
      cancellationPolicy: '',
      reschedulingPolicy: '',
      minimumAdvanceTime: {
        scheduling: { value: 24, unit: 'hours' },
        cancellation: { value: 24, unit: 'hours' },
        rescheduling: { value: 12, unit: 'hours' }
      }
    },
  });

  const watchRequiredInfo = form.watch('requiredInformation');
  const watchOtherInfo = form.watch('otherInformation') || [];
  const watchRequiredDocs = form.watch('requiredDocuments');
  const watchOtherDocs = form.watch('otherDocuments') || [];

  const handleAddInfo = () => {
    if (newInfo.trim()) {
      form.setValue('otherInformation', [...watchOtherInfo, newInfo.trim()]);
      setNewInfo('');
      toast.success('Informação adicionada com sucesso!');
    }
  };

  const handleRemoveInfo = (info: string) => {
    form.setValue('otherInformation', watchOtherInfo.filter(i => i !== info));
    toast.success('Informação removida com sucesso!');
  };

  const handleAddDoc = () => {
    if (newDoc.trim()) {
      form.setValue('otherDocuments', [...watchOtherDocs, newDoc.trim()]);
      setNewDoc('');
      toast.success('Documento adicionado com sucesso!');
    }
  };

  const handleRemoveDoc = (doc: string) => {
    form.setValue('otherDocuments', watchOtherDocs.filter(d => d !== doc));
    toast.success('Documento removido com sucesso!');
  };

  async function onSubmit(values: z.infer<typeof schedulingProcessSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Processo de agendamento salvo com sucesso!");
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
          <CardTitle className="text-white">Processo de Agendamento</CardTitle>
          <CardDescription className="text-gray-100">
            Configure as informações e políticas do processo de agendamento
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
                {/* Required Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Informações Necessárias</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione as informações necessárias para agendar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="requiredInformation"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {REQUIRED_INFORMATION.map((info) => (
                            <FormField
                              key={info.id}
                              control={form.control}
                              name="requiredInformation"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={info.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(info.text)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, info.text])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== info.text
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {info.text}
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

                  {watchRequiredInfo.includes('Outras informações') && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite uma nova informação necessária"
                          value={newInfo}
                          onChange={(e) => setNewInfo(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddInfo}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {watchOtherInfo.map((info) => (
                          <Badge
                            key={info}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {info}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveInfo(info)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Required Documents */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Documentos Necessários</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione os documentos necessários para agendar</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="requiredDocuments"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {REQUIRED_DOCUMENTS.map((doc) => (
                            <FormField
                              key={doc.id}
                              control={form.control}
                              name="requiredDocuments"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={doc.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(doc.text)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, doc.text])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== doc.text
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {doc.text}
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

                  {watchRequiredDocs.includes('Outros documentos') && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite um novo documento necessário"
                          value={newDoc}
                          onChange={(e) => setNewDoc(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddDoc}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {watchOtherDocs.map((doc) => (
                          <Badge
                            key={doc}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {doc}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveDoc(doc)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancellation Policy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Política de Cancelamento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva a política de cancelamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="cancellationPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Cancelamentos com até 24 horas de antecedência são gratuitos. Cancelamentos com menos de 24 horas podem gerar uma taxa de 50% do valor do serviço."
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

                {/* Rescheduling Policy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Política de Reagendamento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva a política de reagendamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="reschedulingPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Reagendamentos com até 12 horas de antecedência são gratuitos. Reagendamentos com menos de 12 horas podem gerar uma taxa de 20% do valor do serviço."
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

                {/* Minimum Advance Time */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Tempo Mínimo de Antecedência</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Defina os tempos mínimos de antecedência</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {/* Scheduling */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="minimumAdvanceTime.scheduling.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Agendamento</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
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
                        name="minimumAdvanceTime.scheduling.unit"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_UNITS.map(unit => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Cancellation */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="minimumAdvanceTime.cancellation.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cancelamento</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
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
                        name="minimumAdvanceTime.cancellation.unit"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_UNITS.map(unit => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Rescheduling */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="minimumAdvanceTime.rescheduling.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reagendamento</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
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
                        name="minimumAdvanceTime.rescheduling.unit"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TIME_UNITS.map(unit => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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