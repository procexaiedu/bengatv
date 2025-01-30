import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  UserCheck,
  UserMinus,
  MessageSquareWarning,
  Shield,
  HelpCircle,
  Plus,
  X,
  Clock
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { COMPLAINT_CHANNELS, RESPONSE_TIME_UNITS } from '@/lib/constants';

const servicePoliciesSchema = z.object({
  welcomeProtocol: z.string()
    .min(50, 'Descreva o protocolo em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  closingProtocol: z.string()
    .min(50, 'Descreva o protocolo em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  complaintPolicy: z.object({
    description: z.string()
      .min(50, 'Descreva a política em pelo menos 50 caracteres')
      .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
    channels: z.array(z.string())
      .min(1, 'Selecione pelo menos um canal de atendimento'),
    otherChannels: z.array(z.string())
      .optional(),
    responseTime: z.object({
      value: z.number()
        .min(1, 'O valor deve ser maior que zero'),
      unit: z.enum(['minutes', 'hours', 'days'])
    })
  }),
  warrantyPolicy: z.string()
    .min(50, 'Descreva a política em pelo menos 50 caracteres')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
});

export default function ServicePolicies({ onBack, onNext }: { onBack: () => void, onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newChannel, setNewChannel] = useState('');
  
  const form = useForm<z.infer<typeof servicePoliciesSchema>>({
    resolver: zodResolver(servicePoliciesSchema),
    defaultValues: {
      welcomeProtocol: '',
      closingProtocol: '',
      complaintPolicy: {
        description: '',
        channels: [],
        otherChannels: [],
        responseTime: {
          value: 24,
          unit: 'hours'
        }
      },
      warrantyPolicy: '',
    },
  });

  const watchChannels = form.watch('complaintPolicy.channels');
  const watchOtherChannels = form.watch('complaintPolicy.otherChannels') || [];

  const handleAddChannel = () => {
    if (newChannel.trim()) {
      form.setValue('complaintPolicy.otherChannels', [...watchOtherChannels, newChannel.trim()]);
      setNewChannel('');
      toast.success('Canal adicionado com sucesso!');
    }
  };

  const handleRemoveChannel = (channel: string) => {
    form.setValue('complaintPolicy.otherChannels', watchOtherChannels.filter(c => c !== channel));
    toast.success('Canal removido com sucesso!');
  };

  async function onSubmit(values: z.infer<typeof servicePoliciesSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onNext(values);
      toast.success("Políticas de atendimento salvas com sucesso!");
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
          <CardTitle className="text-white">Políticas de Atendimento</CardTitle>
          <CardDescription className="text-gray-100">
            Configure os protocolos e políticas de atendimento ao cliente
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
                {/* Welcome Protocol */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Protocolo de Boas-vindas</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva como sua empresa recebe os clientes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="welcomeProtocol"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Saudação personalizada ao cliente, oferta de água ou café, apresentação da equipe, explicação sobre o processo de atendimento..."
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

                {/* Closing Protocol */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserMinus className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Protocolo de Finalização</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva como sua empresa encerra o atendimento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="closingProtocol"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Agradecimento pela preferência, feedback sobre o serviço, apresentação dos próximos passos, despedida cordial..."
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

                {/* Complaint Policy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MessageSquareWarning className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Política de Reclamações</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva como sua empresa lida com reclamações</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="complaintPolicy.description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Reclamações podem ser feitas por telefone, email ou redes sociais e serão respondidas em até 48 horas..."
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

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="complaintPolicy.channels"
                      render={() => (
                        <FormItem>
                          <FormLabel>Canais de Atendimento</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            {COMPLAINT_CHANNELS.map((channel) => (
                              <FormField
                                key={channel.id}
                                control={form.control}
                                name="complaintPolicy.channels"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={channel.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(channel.text)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, channel.text])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== channel.text
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {channel.text}
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

                    {watchChannels.includes('Outros canais') && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Digite um novo canal de atendimento"
                            value={newChannel}
                            onChange={(e) => setNewChannel(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleAddChannel}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {watchOtherChannels.map((channel) => (
                            <Badge
                              key={channel}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {channel}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemoveChannel(channel)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="complaintPolicy.responseTime.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Tempo de Resposta
                            </FormLabel>
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
                        name="complaintPolicy.responseTime.unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unidade de Tempo</FormLabel>
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
                                {RESPONSE_TIME_UNITS.map(unit => (
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

                {/* Warranty Policy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Política de Garantia</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva a política de garantia dos serviços</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="warrantyPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Ex: Oferecemos garantia de 3 meses para todos os serviços de motor e suspensão, desde que não haja mau uso. Não oferecemos garantia para serviços de estética..."
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