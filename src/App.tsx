import { useState } from 'react';
import { Building2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import BasicInfo from './pages/BasicInfo';
import BusinessHours from './pages/BusinessHours';
import Capacity from './pages/Capacity';
import ContentProduction from './pages/ContentProduction';
import Raffles from './pages/Raffles';
import Services from './pages/Services';
import Objectives from './pages/Objectives';
import TargetAudience from './pages/TargetAudience';
import VoiceTone from './pages/VoiceTone';
import BrandPersonality from './pages/BrandPersonality';
import ServicePolicies from './pages/ServicePolicies';
import BusinessRules from './pages/BusinessRules';
import SchedulingProcess from './pages/SchedulingProcess';
import Specialties from './pages/Specialties';
import StandardResponses from './pages/StandardResponses';

export default function App() {
  const [step, setStep] = useState(1);
  interface FormData {
    basicInfo?: any;
    businessHours?: any;
    capacity?: any;
    contentProduction?: any;
    services?: {
      services: any[];
    };
    specialties?: any;
    targetAudience?: any;
    voiceTone?: any;
    brandPersonality?: any;
    schedulingProcess?: any;
    businessRules?: any;
    servicePolicies?: any;
    raffles?: any;
    objectives?: any;
    standardResponses?: any;
  }

  const [formData, setFormData] = useState<FormData>({});

  const handleBasicInfoSubmit = (data: any) => {
    setFormData({ ...formData, basicInfo: data });
    setStep(2);
  };

  const handleBusinessHoursSubmit = (data: any) => {
    setFormData({ ...formData, businessHours: data });
    setStep(3);
  };

  const handleCapacitySubmit = (data: any) => {
    setFormData({ ...formData, capacity: data });
    setStep(4);
  };

  const handleContentProductionSubmit = (data: any) => {
    setFormData({ ...formData, contentProduction: data });
    setStep(5); // Goes to Raffles
  };

  const handleRafflesSubmit = (data: any) => {
    setFormData({ ...formData, raffles: data });
    setStep(6); // Goes to Objectives
  };

  const handleObjectivesSubmit = (data: any) => {
    setFormData({ ...formData, objectives: data });
    setStep(7); // Goes to Services
  };

  const handleServicesSubmit = (data: any) => {
    setFormData({ ...formData, services: data });
    setStep(8); // Goes to Target Audience
  };

  const handleTargetAudienceSubmit = (data: any) => {
    setFormData({ ...formData, targetAudience: data });
    setStep(9); // Goes to Voice Tone
  };

  const handleVoiceToneSubmit = (data: any) => {
    setFormData({ ...formData, voiceTone: data });
    setStep(10); // Goes to Scheduling Process
  };

  const handleSchedulingProcessSubmit = (data: any) => {
    setFormData({ ...formData, schedulingProcess: data });
    setStep(11); // Goes to Business Rules
  };

  const handleBusinessRulesSubmit = (data: any) => {
    setFormData({ ...formData, businessRules: data });
    setStep(12); // Goes to Service Policies
  };

  const handleServicePoliciesSubmit = (data: any) => {
    setFormData({ ...formData, servicePolicies: data });
    setStep(13); // Goes to Brand Personality
  };

  const handleBrandPersonalitySubmit = (data: any) => {
    setFormData({ ...formData, brandPersonality: data });
    setStep(14); // Goes to Specialties
  };

  const handleSpecialtiesSubmit = (data: any) => {
    setFormData({ ...formData, specialties: data });
    setStep(15);
  };

  const handleStandardResponsesSubmit = (data: any) => {
    setFormData({ ...formData, standardResponses: data });
    toast.success("Formulário concluído com sucesso!", {
      description: "Todas as informações foram salvas."
    });
  };

  // TEMPORARY: Admin function to fill form data for testing
  const handleAdminFill = () => {
    // Sample data for each section
    const basicInfoData = {
      companyName: "BengaTV Performance LTDA",
      tradingName: "BengaTV Performance",
      cnpj: "12.345.678/0001-90",
      street: "Rua Teste",
      number: "123",
      complement: "Sala 1",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345-678",
      website: "https://bengatv.com.br",
      youtube: "https://youtube.com/@BengaTV",
      instagram: "https://instagram.com/bengatv",
      otherSocial: "",
      marketSegment: "Serviços",
      annualRevenue: "R$ 500.000 - R$ 1.000.000",
      revenueStreams: ["Serviços", "Parcerias"]
    };

    const businessHoursData = {
      businessHours: {
        monday: { open: "09:00", close: "18:00", enabled: true, breaks: [] },
        tuesday: { open: "09:00", close: "18:00", enabled: true, breaks: [] },
        wednesday: { open: "09:00", close: "18:00", enabled: true, breaks: [] },
        thursday: { open: "09:00", close: "18:00", enabled: true, breaks: [] },
        friday: { open: "09:00", close: "18:00", enabled: true, breaks: [] },
        saturday: { open: "09:00", close: "13:00", enabled: true, breaks: [] },
        sunday: { open: "09:00", close: "13:00", enabled: false, breaks: [] }
      },
      averageVisitDuration: 30,
      holidays: [],
      ticketAverage: 150,
      customersPerDay: 20,
      topServices: ["Remap de ECU", "Instalação de Downpipe"],
      hasSeasonal: false,
      peakHours: {}
    };

    const capacityData = {
      maxDailyAppointments: 20,
      maxSimultaneousAppointments: 5,
      minAppointmentInterval: 30,
      serviceBoxes: 3
    };

    const contentProductionData = {
      publishingFrequency: "semanalmente",
      averageVideoDuration: "10-15",
      contentResponsible: "interno",
      hasEditorialCalendar: "sim",
      monetizationStrategy: "Monetização através de anúncios no YouTube, parcerias com marcas e produtos próprios. Estratégia diversificada para maximizar receita.",
      averageEngagement: "Média de 5000 visualizações por vídeo, 500 likes e 100 comentários. Taxa de engajamento de 10% considerando todas as interações.",
      contentIntegration: "Conteúdo digital integrado com a loja física através de QR codes, promoções exclusivas e eventos especiais.",
      analyticsTools: "YouTube Analytics, Google Analytics, Social Blade",
      hasPaidMedia: "sim",
      paidMediaStrategy: "Investimento mensal em ads do YouTube e Instagram para ampliar alcance. Foco em público qualificado.",
      hasInfluencerPartnerships: "sim",
      influencerPartnershipsDetails: "Parcerias mensais com influenciadores do nicho, alcance médio de 100k por colaboração."
    };

    const servicesData = {
      services: [
        {
          name: "Remap de ECU Stage 2",
          description: "Remapeamento da ECU para ganho de potência e torque, com ajuste fino em dinamômetro",
          duration: "04:00",
          expertise: "electronics",
          category: "performance",
          complexity: "high",
          materials: "Software especializado, cabo OBD2, notebook",
          costPrice: 500,
          salePrice: 1500
        },
        {
          name: "Instalação de Downpipe",
          description: "Instalação de downpipe em aço inox 3\" com delete de catalisador",
          duration: "03:00",
          expertise: "mechanic",
          category: "performance",
          complexity: "medium",
          materials: "Downpipe em aço inox, juntas, parafusos",
          costPrice: 800,
          salePrice: 2000
        },
        {
          name: "Polimento e Cristalização",
          description: "Polimento técnico em 3 etapas com cristalização da pintura",
          duration: "06:00",
          expertise: "aesthetics",
          category: "aesthetics",
          complexity: "medium",
          materials: "Kit de polimento, cristalizador, microfibras",
          costPrice: 300,
          salePrice: 900
        }
      ],
      scheduledServices: ["Remap de ECU Stage 2", "Instalação de Downpipe"],
      nonScheduledServices: ["Polimento e Cristalização"]
    };

    const specialtiesData = {
      brands: ["volkswagen", "bmw", "audi", "mercedes"],
      otherBrands: ["Porsche"],
      modifications: ["engine", "suspension", "brakes", "electronics"],
      otherModifications: ["Preparação para Track Day"],
      popularServices: ["Remap de ECU", "Instalação de Downpipe", "Upgrade de Turbo"],
      competitiveAdvantages: "Especialização em carros europeus de alto desempenho, com mais de 15 anos de experiência. Equipe altamente qualificada, equipamentos de última geração e desenvolvimento próprio de soluções. Dinamômetro próprio para ajuste fino e validação de resultados. Certificações internacionais em programação de ECU."
    };

    const targetAudienceData = {
      typicalProfile: "Homens e mulheres de 25 a 45 anos, apaixonados por carros esportivos e de alto desempenho. Possuem renda média-alta, valorizam qualidade e tecnologia. São entusiastas que buscam melhorar a performance e estética de seus veículos.",
      mainDemands: "Busca por aumento de performance, personalização exclusiva, atendimento especializado e resultados comprovados. Valorizam a transparência no processo e a qualidade dos serviços.",
      commonQuestions: ["Qual o tempo médio de serviço?", "Qual o valor do investimento?", "Há garantia no serviço?"],
      questionAnswers: {
        "Qual o tempo médio de serviço?": "O tempo varia conforme o serviço, mas geralmente entre 2 a 8 horas para serviços de performance.",
        "Qual o valor do investimento?": "Trabalhamos com orçamentos personalizados baseados no seu projeto específico.",
        "Há garantia no serviço?": "Sim, oferecemos garantia de 6 meses para serviços de performance."
      },
      commonObjections: ["Preço elevado", "Perda da garantia", "Receio de problemas"],
      objectionStrategies: {
        "Preço elevado": "Demonstramos o custo-benefício e o retorno do investimento em performance e valorização do veículo.",
        "Perda da garantia": "Explicamos quais modificações mantêm a garantia e oferecemos nossa própria garantia estendida.",
        "Receio de problemas": "Mostramos nosso histórico de sucesso e depoimentos de clientes satisfeitos."
      }
    };

    const voiceToneData = {
      tone: "technical",
      useTechnicalJargon: true,
      sectorTerms: "Termos técnicos como 'Remap', 'Stage', 'Downpipe', 'ECU' são utilizados com explicações claras quando necessário. Evitamos termos como 'Chip de potência' ou 'Reprogramação'.",
      expressionsToAvoid: "'Não sei', 'Talvez', 'Vou ver', 'Impossível'. Sempre oferecemos alternativas e soluções claras.",
      brandPersonality: "Comunicação técnica mas acessível, focada em performance e resultados comprovados. Tom profissional com toques de entusiasmo pelo mundo automotivo."
    };

    const brandPersonalityData = {
      companyValues: [
        { value: "Excelência", description: "Busca constante pela perfeição em cada serviço realizado" },
        { value: "Inovação", description: "Sempre atualizados com as últimas tecnologias do mercado" },
        { value: "Transparência", description: "Comunicação clara e honesta em todos os processos" }
      ],
      communicationStyle: "Comunicação técnica mas acessível, sempre explicando os termos complexos de forma clara. Mantemos um tom profissional mas apaixonado por carros e performance.",
      identityElements: [
        { element: "Expertise Técnica", importance: "Demonstração de conhecimento profundo em preparação automotiva" },
        { element: "Resultados Comprovados", importance: "Apresentação de dados e números reais de performance" }
      ],
      serviceExcellence: "Atendimento personalizado com acompanhamento completo do projeto. Equipe altamente qualificada e certificada internacionalmente. Uso de equipamentos de última geração e desenvolvimento próprio de soluções."
    };

    const schedulingProcessData = {
      requiredInformation: ["Nome completo", "Telefone", "Email", "Modelo do veículo"],
      requiredDocuments: ["CNH", "Documento do veículo"],
      cancellationPolicy: "Cancelamentos com 24 horas de antecedência não geram custos. Cancelamentos com menos de 24 horas podem gerar taxa de 20% do valor do serviço.",
      reschedulingPolicy: "Reagendamentos com 12 horas de antecedência são gratuitos. Com menos tempo, pode haver taxa de remarcação.",
      minimumAdvanceTime: {
        scheduling: { value: 24, unit: "hours" },
        cancellation: { value: 24, unit: "hours" },
        rescheduling: { value: 12, unit: "hours" }
      }
    };

    const businessRulesData = {
      schedulingConditions: "Agendamentos devem ser feitos com pelo menos 24h de antecedência. É necessário um sinal de 30% para confirmar a reserva em serviços acima de R$ 1.000.",
      specificRestrictions: "Não realizamos serviços em veículos com documentação irregular. Alguns serviços requerem avaliação prévia do veículo.",
      servicePriorities: "Prioridade para serviços agendados. Emergências são atendidas conforme disponibilidade da agenda.",
      specialCases: "Clientes fidelidade têm prioridade na agenda. Projetos especiais podem requerer consultoria prévia."
    };

    const servicePoliciesData = {
      welcomeProtocol: "Recepção personalizada, apresentação da equipe e instalações, explicação detalhada do processo e prazos, café/água disponível na espera.",
      closingProtocol: "Apresentação do serviço realizado, testes de qualidade, orientações de uso e manutenção, agendamento de retorno se necessário.",
      complaintPolicy: {
        description: "Todas as reclamações são tratadas com prioridade máxima. Feedback é usado para melhorar processos.",
        channels: ["WhatsApp", "Email", "Telefone"],
        responseTime: { value: 2, unit: "hours" }
      },
      warrantyPolicy: "Garantia de 6 meses para serviços de performance, desde que mantidas as condições de uso especificadas. Suporte técnico disponível durante todo o período."
    };

    // Update form data and move to the last section
    setFormData({
      basicInfo: basicInfoData,
      businessHours: businessHoursData,
      capacity: capacityData,
      contentProduction: contentProductionData,
      services: servicesData,
      specialties: specialtiesData,
      targetAudience: targetAudienceData,
      voiceTone: voiceToneData,
      brandPersonality: brandPersonalityData,
      schedulingProcess: schedulingProcessData,
      businessRules: businessRulesData,
      servicePolicies: servicePoliciesData,
      raffles: {
        frequency: "mensal",
        objective: "engajamento",
        promotionDetails: "Divulgação através de redes sociais e parcerias estratégicas...",
        participationProcess: "Processo simplificado através de plataforma digital...",
        averageRevenue: 5000,
        averageCost: 2000,
        averageProfit: 3000,
        platforms: "Instagram, Facebook, Site próprio",
        hasPartnerships: "sim",
        partnershipDetails: "Parcerias com lojas locais e influenciadores...",
        averageEngagement: "Média de 1000 participantes por rifa...",
        averageLeads: 200,
        averageTicket: 50
      },
      objectives: {
        currentChallenges: "Dificuldade em escalar operações, gerenciar agendamentos e manter consistência na produção de conteúdo. Necessidade de melhorar a integração entre canais digitais e físicos.",
        objectives: "Automatizar processos de agendamento, melhorar eficiência operacional e aumentar engajamento nas redes sociais. Buscar crescimento sustentável com tecnologia.",
        roiExpectations: "Redução de 30% no tempo gasto com gestão de agendamentos, aumento de 50% na taxa de conversão de leads e crescimento de 40% na receita em 12 meses.",
        specificProject: "Desenvolvimento de um sistema integrado de agendamento online com CRM e analytics, permitindo melhor gestão de clientes e métricas de desempenho."
      }
    });
    setStep(14);
    toast.success("Dados de teste preenchidos com sucesso!");
  };

  const progress = (step / 15) * 100;

  return (
    <div className="min-h-screen bg-[#F3F1EC] p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-[#063E65]" />
            <h1 className="text-2xl font-semibold text-[#063E65]">ProceX AI</h1>
          </div>
          {/* TEMPORARY: Admin button for testing */}
          <Button
            onClick={handleAdminFill}
            variant="outline"
            className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
          >
            <Wand2 className="w-4 h-4 mr-2 text-yellow-600" />
            <span className="text-yellow-700">Preencher Teste</span>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-white rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#063E65] to-[#1F9AF3]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {step === 1 && <BasicInfo onNext={handleBasicInfoSubmit} />}
        {step === 2 && (
          <BusinessHours
            onBack={() => setStep(1)}
            onNext={handleBusinessHoursSubmit}
          />
        )}
        {step === 3 && (
          <Capacity
            onBack={() => setStep(2)}
            onNext={handleCapacitySubmit}
          />
        )}
        {step === 4 && (
          <ContentProduction
            onBack={() => setStep(3)}
            onNext={handleContentProductionSubmit}
          />
        )}
        {step === 5 && (
          <Raffles
            onBack={() => setStep(4)}
            onNext={handleRafflesSubmit}
          />
        )}
        {step === 6 && (
          <Objectives
            onBack={() => setStep(5)}
            onNext={handleObjectivesSubmit}
          />
        )}
        {step === 7 && (
          <Services
            onBack={() => setStep(6)}
            onNext={handleServicesSubmit}
          />
        )}
        {step === 8 && (
          <TargetAudience
            onBack={() => setStep(7)}
            onNext={handleTargetAudienceSubmit}
          />
        )}
        {step === 9 && (
          <VoiceTone
            onBack={() => setStep(8)}
            onNext={handleVoiceToneSubmit}
          />
        )}
        {step === 10 && (
          <SchedulingProcess
            onBack={() => setStep(9)}
            onNext={handleSchedulingProcessSubmit}
          />
        )}
        {step === 11 && (
          <BusinessRules
            onBack={() => setStep(10)}
            onNext={handleBusinessRulesSubmit}
          />
        )}
        {step === 12 && (
          <ServicePolicies
            onBack={() => setStep(11)}
            onNext={handleServicePoliciesSubmit}
          />
        )}
        {step === 13 && (
          <BrandPersonality
            onBack={() => setStep(12)}
            onNext={handleBrandPersonalitySubmit}
          />
        )}
        {step === 14 && (
          <Specialties
            onBack={() => setStep(13)}
            onNext={handleSpecialtiesSubmit}
            services={formData.services?.services || []}
          />
        )}
        {step === 15 && (
          <StandardResponses
            onBack={() => setStep(14)}
            onNext={handleStandardResponsesSubmit}
          />
        )}
      </div>
      <Toaster />
    </div>
  );
}