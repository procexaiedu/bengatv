import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as z from 'zod';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ListTodo,
  Clock,
  Plus,
  Trash2,
  HelpCircle,
  Copy,
  DollarSign,
  FileText,
  Eye,
  Wrench,
  CalendarClock,
  CalendarX,
  Gauge,
  Layers
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IMaskInput } from 'react-imask';
import { EXPERTISE_LEVELS, COMMON_AUTOMOTIVE_SERVICES, SERVICE_CATEGORIES, COMPLEXITY_LEVELS } from '@/lib/constants';
import type { Service } from '@/types/business';
import { cn } from '@/lib/utils';

const serviceSchema = z.object({
  name: z.string().min(3, 'Nome do serviço deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  costPrice: z.number().min(0, 'O valor deve ser maior ou igual a zero').optional(),
  salePrice: z.number().min(0, 'O valor deve ser maior ou igual a zero').optional(),
  expertise: z.enum(['mechanic', 'tuner', 'electronics', 'aesthetics']).optional(),
  category: z.enum(['mechanical', 'electrical', 'aesthetics', 'performance', 'diagnostic', 'maintenance'], {
    required_error: 'Categoria é obrigatória'
  }),
  complexity: z.enum(['low', 'medium', 'high']).optional(),
  duration: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido. Use HH:MM'),
  materials: z.string().optional(),
});

const servicesSchema = z.object({
  services: z.array(serviceSchema)
    .min(1, 'Adicione pelo menos um serviço'),
  scheduledServices: z.array(z.string())
    .min(1, 'Selecione pelo menos um serviço que necessita agendamento'),
  nonScheduledServices: z.array(z.string())
    .optional(),
});

export default function Services({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof servicesSchema>>({
    resolver: zodResolver(servicesSchema),
    defaultValues: {
      services: [{ 
        name: '', 
        duration: '', 
        description: '', 
        costPrice: 0, 
        salePrice: 0,
        materials: '',
        category: undefined,
        complexity: undefined
      }],
      scheduledServices: [],
      nonScheduledServices: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services"
  });

  const watchServices = form.watch("services");
  const watchScheduledServices = form.watch("scheduledServices");
  const watchNonScheduledServices = form.watch("nonScheduledServices");

  // Validate that a service can't be in both scheduled and non-scheduled lists
  React.useEffect(() => {
    const scheduledSet = new Set(watchScheduledServices);
    const nonScheduledSet = new Set(watchNonScheduledServices);

    const intersection = [...scheduledSet].filter(x => nonScheduledSet.has(x));
    if (intersection.length > 0) {
      form.setError("nonScheduledServices", {
        type: "manual",
        message: "Um serviço não pode estar em ambas as listas"
      });
    } else {
      form.clearErrors("nonScheduledServices");
    }
  }, [watchScheduledServices, watchNonScheduledServices, form]);

  const duplicateService = (index: number) => {
    const service = form.getValues(`services.${index}`);
    append({
      name: `${service.name} (Cópia)`,
      duration: service.duration,
      description: '',
      costPrice: service.costPrice,
      salePrice: service.salePrice,
      expertise: service.expertise,
      category: service.category,
      complexity: service.complexity,
      materials: ''
    });
    toast.success("Serviço duplicado com sucesso!");
  };

  const loadServiceExample = () => {
    const randomService = COMMON_AUTOMOTIVE_SERVICES[
      Math.floor(Math.random() * COMMON_AUTOMOTIVE_SERVICES.length)
    ];
    append({
      ...randomService,
      costPrice: 0,
      salePrice: 0
    });
    toast.success("Exemplo de serviço adicionado!");
  };

  const [previewMode, setPreviewMode] = useState(false);

  async function onSubmit(values: z.infer<typeof servicesSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Serviços cadastrados com sucesso!");
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
          <CardTitle className="text-white">Serviços Oferecidos</CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="text-gray-100">
              Cadastre os serviços oferecidos e suas características
            </CardDescription>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={loadServiceExample}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Wrench className="w-4 h-4 mr-2" />
                Adicionar Exemplo
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
            </div>
          </div>
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
                {/* Services List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {previewMode ? 'Visualização dos Serviços' : 'Lista de Serviços'}
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cadastre os serviços automotivos oferecidos</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <LayoutGroup>
                  {previewMode ? (
                    <div className="space-y-4">
                      {fields.map((field, index) => {
                        const service = form.getValues(`services.${index}`);
                        if (!service.name) return null;
                        return (
                          <motion.div
                            key={field.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 border rounded-lg bg-gray-50"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-lg">{service.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">Duração: {service.duration}</p>
                                {service.salePrice > 0 && (
                                  <p className="text-sm text-gray-600">
                                    Orçamento médio: R$ {service.salePrice.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                            {service.materials && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">Materiais:</span> {service.materials}
                              </div>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                {
                                  'bg-blue-100 text-blue-800': service.category === 'mechanical',
                                  'bg-yellow-100 text-yellow-800': service.category === 'electrical',
                                  'bg-purple-100 text-purple-800': service.category === 'aesthetics',
                                  'bg-red-100 text-red-800': service.category === 'performance',
                                  'bg-green-100 text-green-800': service.category === 'diagnostic',
                                  'bg-gray-100 text-gray-800': service.category === 'maintenance',
                                }
                              )}>
                                {SERVICE_CATEGORIES.find(cat => cat.value === service.category)?.label}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {EXPERTISE_LEVELS.find(level => level.value === service.expertise)?.label || 'Não especificado'}
                              </span>
                              {service.complexity && (
                                <span className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                  {
                                    'bg-green-100 text-green-800': service.complexity === 'low',
                                    'bg-yellow-100 text-yellow-800': service.complexity === 'medium',
                                    'bg-red-100 text-red-800': service.complexity === 'high',
                                  }
                                )}>
                                  Complexidade {COMPLEXITY_LEVELS.find(level => level.value === service.complexity)?.label}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-6">
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {/* Service Name */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome do Serviço</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <ListTodo className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <Input {...field} className="pl-10" 
                                      placeholder="Ex: Remap de ECU Stage 2, Instalação de Downpipe" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Duration */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duração</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <Controller
                                      name={`services.${index}.duration`}
                                      control={form.control}
                                      render={({ field: { onChange, value } }) => (
                                        <IMaskInput
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                          mask="00:00"
                                          unmask={false}
                                          value={value}
                                          onAccept={onChange}
                                          placeholder="HH:MM"
                                        />
                                      )}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Description */}
                        <FormField
                          control={form.control}
                          name={`services.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição do Serviço</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <FileText className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                                  <Textarea
                                    {...field}
                                    className="min-h-[80px] pl-10"
                                    placeholder="Descreva detalhadamente o serviço..."
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`services.${index}.materials`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Materiais Utilizados</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Wrench className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
                                  <Textarea
                                    {...field}
                                    className="min-h-[80px] pl-10"
                                    placeholder="Ex: Aço inox (Downpipe), kit de polimento, lubrificante 5W30"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          {/* Cost Price */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.costPrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preço de Custo</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <Input
                                      type="number"
                                      className="pl-10 text-right"
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

                          {/* Sale Price */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.salePrice`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Orçamento Médio</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <Input
                                      type="number"
                                      className="pl-10 text-right"
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

                          {/* Category */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.category`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione a categoria" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {SERVICE_CATEGORIES.map(category => (
                                      <SelectItem key={category.value} value={category.value}>
                                        {category.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {/* Complexity */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.complexity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Complexidade</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione a complexidade" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {COMPLEXITY_LEVELS.map(level => (
                                      <SelectItem key={level.value} value={level.value}>
                                        <div className="flex flex-col">
                                          <span>{level.label}</span>
                                          <span className="text-xs text-gray-500">{level.description}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Expertise */}
                          <FormField
                            control={form.control}
                            name={`services.${index}.expertise`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nível de Expertise</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {EXPERTISE_LEVELS.map(level => (
                                      <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => duplicateService(index)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </Button>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>)}
                  </LayoutGroup>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ 
                      name: '', 
                      duration: '', 
                      description: '', 
                      costPrice: 0, 
                      salePrice: 0,
                      materials: '',
                      category: undefined,
                      complexity: undefined
                    })}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </div>

                {/* Scheduled Services */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Serviços com Agendamento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione os serviços que necessitam de agendamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="scheduledServices"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {watchServices.map((service, index) => {
                            if (!service.name) return null;
                            return (
                              <FormField
                                key={index}
                                control={form.control}
                                name="scheduledServices"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={index}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(service.name)}
                                          className={cn({
                                            'border-blue-500 data-[state=checked]:bg-blue-500': service.category === 'mechanical',
                                            'border-yellow-500 data-[state=checked]:bg-yellow-500': service.category === 'electrical',
                                            'border-purple-500 data-[state=checked]:bg-purple-500': service.category === 'aesthetics',
                                            'border-red-500 data-[state=checked]:bg-red-500': service.category === 'performance',
                                            'border-green-500 data-[state=checked]:bg-green-500': service.category === 'diagnostic',
                                            'border-gray-500 data-[state=checked]:bg-gray-500': service.category === 'maintenance',
                                          })}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, service.name])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== service.name
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {service.name}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Non-Scheduled Services */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarX className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Serviços sem Agendamento</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione os serviços que não necessitam de agendamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="nonScheduledServices"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {watchServices.map((service, index) => {
                            if (!service.name) return null;
                            return (
                              <FormField
                                key={index}
                                control={form.control}
                                name="nonScheduledServices"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={index}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(service.name)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, service.name])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== service.name
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {service.name}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            );
                          })}
                        </div>
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