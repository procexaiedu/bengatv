import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  Building2,
  ChevronRight,
  Globe,
  Youtube,
  Instagram,
  Share2,
  MapPinned,
  Home,
  Building,
  Hash,
  Loader2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const WEBSITE_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
const SOCIAL_MEDIA_REGEX = /^https?:\/\/(www\.)?(youtube\.com|instagram\.com|facebook\.com|linkedin\.com|twitter\.com)\/.*$/;

const basicInfoSchema = z.object({
  companyName: z.string()
    .min(2, 'Nome da empresa deve ter pelo menos 2 caracteres')
    .max(100, 'Nome da empresa deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s&.-]+$/, 'Nome da empresa contém caracteres inválidos'),
  tradingName: z.string()
    .min(2, 'Nome fantasia deve ter pelo menos 2 caracteres')
    .max(100, 'Nome fantasia deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s&.-]+$/, 'Nome fantasia contém caracteres inválidos'),
  cnpj: z.string()
    .min(18, 'CNPJ é obrigatório') // Including dots and dashes
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ deve estar no formato 00.000.000/0000-00')
    .refine((cnpj) => {
      // Remove non-digits
      const numbers = cnpj.replace(/[^\d]/g, '');
      
      // Basic validation
      if (numbers.length !== 14) return false;
      if (/^(\d)\1{13}$/.test(numbers)) return false; // All digits are the same
      
      // Validate check digits
      const calcDigit = (arr: number[]) => {
        const weights = Array.from({ length: arr.length }, (_, i) => (arr.length + 1) - i);
        const sum = arr.reduce((acc, cur, idx) => acc + cur * weights[idx], 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
      };
      
      // First check digit
      const digits = numbers.split('').map(Number);
      const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const sum1 = digits.slice(0, 12).reduce((acc, cur, idx) => acc + cur * weights1[idx], 0);
      const digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);
      if (digit1 !== digits[12]) return false;
      
      // Second check digit
      const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const sum2 = digits.slice(0, 13).reduce((acc, cur, idx) => acc + cur * weights2[idx], 0);
      const digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);
      if (digit2 !== digits[13]) return false;
      
      return true;
    }, 'CNPJ inválido'),
  street: z.string()
    .min(3, 'Rua deve ter pelo menos 3 caracteres')
    .max(100, 'Rua deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s,.-]+$/, 'Rua contém caracteres inválidos'),
  number: z.string()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres')
    .regex(/^[0-9]+[a-zA-Z]?$/, 'Número deve conter apenas dígitos, opcionalmente seguido por uma letra'),
  complement: z.string()
    .max(50, 'Complemento deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s,.-]*$/, 'Complemento contém caracteres inválidos')
    .optional(),
  neighborhood: z.string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s.-]+$/, 'Bairro contém caracteres inválidos'),
  city: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s.-]+$/, 'Cidade deve conter apenas letras, espaços e hífens'),
  state: z.string()
    .length(2, 'Estado deve ter exatamente 2 letras')
    .regex(/^[A-Z]{2}$/, 'Estado deve conter apenas letras maiúsculas'),
  zipCode: z.string()
    .min(9, 'CEP é obrigatório') // Including dash
    .regex(/^\d{5}\-\d{3}$/, 'CEP deve estar no formato 00000-000'),
  website: z.string()
    .min(1, 'Website é obrigatório')
    .regex(WEBSITE_REGEX, 'Website deve ser uma URL válida começando com http:// ou https://'),
  youtube: z.string()
    .regex(SOCIAL_MEDIA_REGEX, 'URL do YouTube inválida')
    .optional()
    .or(z.literal('')),
  instagram: z.string()
    .regex(SOCIAL_MEDIA_REGEX, 'URL do Instagram inválida')
    .optional()
    .or(z.literal('')),
  otherSocial: z.string()
    .regex(WEBSITE_REGEX, 'URL inválida')
    .optional()
    .or(z.literal('')),
  marketSegment: z.string().min(1, 'Segmento de mercado é obrigatório'),
  annualRevenue: z.string().min(1, 'Faturamento anual é obrigatório'),
  revenueStreams: z.array(z.string())
    .min(1, 'Selecione pelo menos uma fonte de receita')
    .max(6, 'Selecione no máximo 6 fontes de receita'),
});

const marketSegments = [
  'E-commerce',
  'Varejo',
  'Tecnologia',
  'Serviços',
  'Indústria',
  'Outros'
];

const revenueRanges = [
  'Até R$ 100.000',
  'R$ 100.000 - R$ 500.000',
  'R$ 500.000 - R$ 1.000.000',
  'Acima de R$ 1.000.000'
];

const revenueStreams = [
  'Venda de Produtos',
  'Serviços',
  'Assinaturas',
  'Publicidade',
  'Parcerias',
  'Outros'
];

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type FormData = z.infer<typeof basicInfoSchema>;

export default function BasicInfo({ onNext }: { onNext: (data: any) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      companyName: '',
      tradingName: '',
      cnpj: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      website: '',
      youtube: '',
      instagram: '',
      otherSocial: '',
      marketSegment: '',
      annualRevenue: '',
      revenueStreams: [],
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      // Validate all fields before proceeding
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Por favor, preencha todos os campos obrigatórios corretamente.");
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clean up empty social media fields
      const cleanedValues = {
        ...values,
        youtube: values.youtube || undefined,
        instagram: values.instagram || undefined,
        otherSocial: values.otherSocial || undefined
      };

      onNext(cleanedValues);
      toast.success("Informações básicas salvas com sucesso.");
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Ocorreu um erro ao salvar as informações.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-white shadow-lg border-0">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#063E65] to-[#1F9AF3]">
          <CardTitle className="text-white">Informações Básicas</CardTitle>
          <CardDescription className="text-gray-100">
            Por favor, forneça as informações básicas da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nome da Empresa</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input className="pl-10" placeholder="Nome da Empresa" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tradingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Nome Fantasia</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input className="pl-10" placeholder="Nome Fantasia" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-2 gap-6"
              >
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        CNPJ
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Controller
                            name="cnpj"
                            control={form.control}
                            render={({ field: { onChange, value } }) => (
                              <IMaskInput
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                mask="00.000.000/0000-00"
                                unmask={false}
                                value={value}
                                onAccept={onChange}
                                placeholder="00.000.000/0000-00"
                              />
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Website</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input className="pl-10" placeholder="https://exemplo.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-900">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Rua</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="Rua" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Número</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" placeholder="Número" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Complemento</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input className="pl-10" placeholder="Complemento" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Bairro</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="Bairro" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          CEP
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Controller
                              name="zipCode"
                              control={form.control}
                              render={({ field: { onChange, value } }) => (
                                <IMaskInput
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                  mask="00000-000"
                                  unmask={false}
                                  value={value}
                                  onAccept={onChange}
                                  placeholder="00000-000"
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Cidade</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="Cidade" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-900">Redes Sociais</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">YouTube</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="URL do YouTube" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Instagram</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="URL do Instagram" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherSocial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">Outras</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Share2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                            <Input className="pl-10" placeholder="URL de outras redes" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-2 gap-6"
              >
                <FormField
                  control={form.control}
                  name="marketSegment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Segmento de Mercado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o segmento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {marketSegments.map((segment) => (
                            <SelectItem key={segment} value={segment}>
                              {segment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="annualRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Faturamento Anual</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa de faturamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {revenueRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <FormField
                  control={form.control}
                  name="revenueStreams"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-sm font-medium text-gray-700">Fontes de Receita</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {revenueStreams.map((stream) => (
                          <FormField
                            key={stream}
                            control={form.control}
                            name="revenueStreams"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={stream}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(stream)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, stream])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== stream
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {stream}
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
              </motion.div>
              
              <div className="flex justify-end pt-6">
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