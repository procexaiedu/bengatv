import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Car,
  Wrench,
  Star,
  Trophy,
  HelpCircle,
  Plus,
  X
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { CAR_BRANDS, MODIFICATION_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const specialtiesSchema = z.object({
  brands: z.array(z.string())
    .min(1, 'Selecione pelo menos uma marca'),
  otherBrands: z.array(z.string())
    .optional(),
  modifications: z.array(z.string())
    .min(1, 'Selecione pelo menos um tipo de modificação'),
  otherModifications: z.array(z.string())
    .optional(),
  popularServices: z.array(z.string())
    .min(1, 'Adicione pelo menos um serviço popular'),
  competitiveAdvantages: z.string()
    .min(50, 'Descreva os diferenciais em pelo menos 50 caracteres')
    .max(500, 'A descrição deve ter no máximo 500 caracteres'),
});

export default function Specialties({ onBack, onNext, services = [] }: { 
  onBack: () => void, 
  onNext: (data: any) => void,
  services?: Array<{ name: string }>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBrand, setNewBrand] = useState('');
  const [newModification, setNewModification] = useState('');
  const [serviceCommandOpen, setServiceCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const form = useForm<z.infer<typeof specialtiesSchema>>({
    resolver: zodResolver(specialtiesSchema),
    defaultValues: {
      brands: [],
      otherBrands: [],
      modifications: [],
      otherModifications: [],
      popularServices: [],
      competitiveAdvantages: '',
    },
  });

  const watchBrands = form.watch('brands');
  const watchOtherBrands = form.watch('otherBrands') || [];
  const watchModifications = form.watch('modifications');
  const watchOtherModifications = form.watch('otherModifications') || [];
  const watchPopularServices = form.watch('popularServices');

  const handleAddBrand = () => {
    if (newBrand.trim()) {
      form.setValue('otherBrands', [...watchOtherBrands, newBrand.trim()]);
      setNewBrand('');
      toast.success('Marca adicionada com sucesso!');
    }
  };

  const handleRemoveBrand = (brand: string) => {
    form.setValue('otherBrands', watchOtherBrands.filter(b => b !== brand));
    toast.success('Marca removida com sucesso!');
  };

  const handleAddModification = () => {
    if (newModification.trim()) {
      form.setValue('otherModifications', [...watchOtherModifications, newModification.trim()]);
      setNewModification('');
      toast.success('Modificação adicionada com sucesso!');
    }
  };

  const handleRemoveModification = (modification: string) => {
    form.setValue('otherModifications', watchOtherModifications.filter(m => m !== modification));
    toast.success('Modificação removida com sucesso!');
  };

  const handleAddService = (serviceName: string) => {
    if (!watchPopularServices.includes(serviceName)) {
      form.setValue('popularServices', [...watchPopularServices, serviceName]);
      toast.success('Serviço adicionado com sucesso!');
      setServiceCommandOpen(false);
    }
  };

  const handleRemoveService = (service: string) => {
    form.setValue('popularServices', watchPopularServices.filter(s => s !== service));
    toast.success('Serviço removido com sucesso!');
  };

  async function onSubmit(values: z.infer<typeof specialtiesSchema>) {
    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form data:', values);
      onNext(values);
      toast.success("Especialidades salvas com sucesso!");
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
          <CardTitle className="text-white">Especialidades</CardTitle>
          <CardDescription className="text-gray-100">
            Configure as especialidades e diferenciais da sua preparadora
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
                {/* Car Brands */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Marcas Atendidas</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione as marcas de veículos atendidas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="brands"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-3 gap-4">
                          {CAR_BRANDS.map((brand) => (
                            <FormField
                              key={brand.value}
                              control={form.control}
                              name="brands"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={brand.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(brand.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, brand.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== brand.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {brand.label}
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

                  {watchBrands.includes('other') && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o nome da marca"
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddBrand}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {watchOtherBrands.map((brand) => (
                          <Badge
                            key={brand}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {brand}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveBrand(brand)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modification Types */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Tipos de Modificações</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecione os tipos de modificações realizadas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="modifications"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-4">
                          {MODIFICATION_TYPES.map((type) => (
                            <FormField
                              key={type.value}
                              control={form.control}
                              name="modifications"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type.value}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type.value)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type.value])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type.value
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-normal">
                                        {type.label}
                                      </FormLabel>
                                      <p className="text-sm text-muted-foreground">
                                        {type.description}
                                      </p>
                                    </div>
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

                  {watchModifications.includes('other') && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite o tipo de modificação"
                          value={newModification}
                          onChange={(e) => setNewModification(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleAddModification}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {watchOtherModifications.map((modification) => (
                          <Badge
                            key={modification}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {modification}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleRemoveModification(modification)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Popular Services */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Serviços Mais Procurados</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Adicione os serviços mais populares</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Popover open={serviceCommandOpen} onOpenChange={setServiceCommandOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={serviceCommandOpen}
                          className="w-full justify-between"
                        >
                          <span>Selecione um serviço...</span>
                          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Procurar serviço..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                            <CommandGroup>
                              {(services || []).map((service) => (
                                <CommandItem
                                  key={service.name}
                                  onSelect={() => handleAddService(service.name)}
                                >
                                  {service.name}
                                </CommandItem>
                              ))}
                              {(!services || services.length === 0) && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  Nenhum serviço cadastrado.
                                </div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2">
                      {watchPopularServices.map((service) => (
                        <Badge
                          key={service}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {service}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveService(service)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <FormField
                      control={form.control}
                      name="popularServices"
                      render={({ field }) => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Competitive Advantages */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">Diferenciais Competitivos *</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Descreva os principais diferenciais da sua preparadora</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="competitiveAdvantages"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              {...field}
                              className="min-h-[120px] resize-none"
                              placeholder="Descreva os principais diferenciais da sua preparadora..."
                              maxLength={500}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value.length}/500
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="mt-2" />
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