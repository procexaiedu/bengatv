export interface BusinessHour {
  open: string;
  close: string;
  enabled: boolean;
  breaks: Break[];
}

export interface Break {
  start: string;
  end: string;
}

export interface Service {
  name: string;
  description?: string;
  costPrice?: number;
  salePrice?: number;
  expertise?: 'mechanic' | 'tuner' | 'electronics' | 'aesthetics';
  category: 'mechanical' | 'electrical' | 'aesthetics' | 'performance' | 'diagnostic' | 'maintenance';
  complexity: 'low' | 'medium' | 'high';
  duration: string;
  materials?: string;
}

export interface ServicesFormData {
  services: Service[];
  scheduledServices: string[];
  nonScheduledServices: string[];
}

export interface PeakHour {
  start: string;
  end: string;
  estimatedCustomers: number;
}

export interface BusinessHoursFormData {
  businessHours: {
    [key: string]: BusinessHour;
  };
  averageVisitDuration: number;
  holidays: Date[];
  ticketAverage: number;
  customersPerDay: number;
  topServices: string[];
  hasSeasonal: boolean;
  seasonalDetails?: string;
  peakHours: {
    [key: string]: PeakHour[];
  };
}

export interface SpecialtiesFormData {
  brands: string[];
  otherBrands?: string[];
  modifications: string[];
  otherModifications?: string[];
  popularServices: string[];
  competitiveAdvantages: string;
}

export interface SchedulingProcessFormData {
  requiredInformation: string[];
  otherInformation?: string[];
  requiredDocuments: string[];
  otherDocuments?: string[];
  cancellationPolicy: string;
  reschedulingPolicy: string;
  minimumAdvanceTime: {
    scheduling: { value: number; unit: 'hours' | 'days' | 'weeks' };
    cancellation: { value: number; unit: 'hours' | 'days' | 'weeks' };
    rescheduling: { value: number; unit: 'hours' | 'days' | 'weeks' };
  };
}

export interface BusinessRulesFormData {
  schedulingConditions: string;
  specificRestrictions: string;
  servicePriorities: string;
  specialCases: string;
}

export interface ServicePoliciesFormData {
  welcomeProtocol: string;
  closingProtocol: string;
  complaintPolicy: {
    description: string;
    channels: string[];
    otherChannels?: string[];
    responseTime: {
      value: number;
      unit: 'minutes' | 'hours' | 'days';
    };
  };
  warrantyPolicy: string;
}

export interface VoiceToneFormData {
  tone: 'formal' | 'informal' | 'friendly' | 'technical';
  useTechnicalJargon: boolean;
  sectorTerms: string;
  expressionsToAvoid: string;
  brandPersonality: string;
}

export interface BrandPersonalityFormData {
  companyValues: Array<{
    value: string;
    description: string;
  }>;
  communicationStyle: string;
  identityElements: Array<{
    element: string;
    importance: string;
  }>;
  serviceExcellence: string;
}

export interface TargetAudienceFormData {
  typicalProfile: string;
  mainDemands: string;
  commonQuestions: string[];
  questionAnswers: Record<string, string>;
  otherQuestions?: string[];
  otherQuestionAnswers?: Record<string, string>;
  commonObjections: string[];
  objectionStrategies: Record<string, string>;
  otherObjections?: string[];
  otherObjectionStrategies?: Record<string, string>;
}