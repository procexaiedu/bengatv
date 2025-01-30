# ProceX AI - Documentação do Projeto

## 🎯 Visão Geral

O ProceX AI é um sistema de formulário multi-etapas desenvolvido para coletar informações detalhadas sobre empresas e seus objetivos com a ProceX AI. O projeto utiliza tecnologias modernas e segue as melhores práticas de desenvolvimento web.

## 🛠 Stack Tecnológica

### Core
- React 18.3.1
- TypeScript
- Vite 5.4
- Tailwind CSS

### UI/UX
- shadcn/ui (componentes base)
- Lucide React (ícones)
- Framer Motion (animações)
- Recharts (gráficos)

### Formulários e Validação
- React Hook Form
- Zod
- IMask (máscaras de input para CNPJ, CEP, etc)
- React Day Picker (calendário)

### Notificações
- Sonner (toasts)

### Gráficos e Visualização
- Recharts (gráficos de capacidade)

## 📋 Estrutura do Formulário

O formulário é dividido em 13 seções principais:

1. **Informações Básicas** (`BasicInfo.tsx`)
   - Dados da empresa
   - Endereço
   - Redes sociais
   - Segmento de mercado
   - Faturamento

2. **Horários de Funcionamento** (`BusinessHours.tsx`)
   - Horários por dia da semana
   - Intervalos
   - Horários de pico
   - Feriados
   - Sazonalidade
   - Ticket médio
   - Clientes por dia
   - Serviços mais procurados

3. **Capacidade de Atendimento** (`Capacity.tsx`)
   - Agendamentos por dia
   - Agendamentos simultâneos
   - Intervalo entre agendamentos
   - Boxes de atendimento
   - Visualização gráfica da capacidade com Recharts
   - Distribuição de horários

4. **Produção de Conteúdo** (`ContentProduction.tsx`)
   - Frequência de publicação
   - Duração dos vídeos
   - Responsável pelo conteúdo
   - Monetização
   - Métricas de engajamento
   - Integração de conteúdo
   - Mídia paga
   - Parcerias com influenciadores

5. **Rifas** (`Raffles.tsx`)
   - Frequência das rifas
   - Objetivos
   - Processo de participação
   - Informações financeiras
   - Plataformas utilizadas
   - Parcerias
   - Métricas de engajamento

6. **Objetivos com a ProceX AI** (`Objectives.tsx`)
   - Desafios atuais
   - Objetivos esperados
   - Expectativas de ROI
   - Projetos específicos

7. **Serviços Oferecidos** (`Services.tsx`)
   - Lista completa de serviços
   - Serviços com agendamento
   - Serviços sem agendamento
   - Descrição detalhada
   - Materiais utilizados
   - Tempo médio de execução
   - Preços e custos
   - Categorias (mecânica, elétrica, estética, performance, etc)
   - Níveis de complexidade (baixa, média, alta)
   - Expertise necessária
   - Modo de visualização e edição

8. **Público-Alvo** (`TargetAudience.tsx`)
   - Perfil típico dos clientes
   - Principais demandas
   - Dúvidas frequentes com respostas padronizadas
   - Objeções comuns com estratégias de contorno
   - Sistema de tags para categorização

9. **Tom de Voz** (`VoiceTone.tsx`)
   - Tom de comunicação
   - Uso de termos técnicos
   - Termos específicos do setor
   - Expressões a evitar
   - Personalidade da marca

10. **Processo de Agendamento** (`SchedulingProcess.tsx`)
    - Informações necessárias
    - Documentos requeridos
    - Política de cancelamento
    - Política de reagendamento
    - Tempos mínimos de antecedência

11. **Regras de Negócio** (`BusinessRules.tsx`)
    - Condições para agendamento
    - Restrições específicas
    - Prioridades de atendimento
    - Casos especiais

12. **Políticas de Atendimento** (`ServicePolicies.tsx`)
    - Protocolo de boas-vindas
    - Protocolo de finalização
    - Política de reclamações
    - Política de garantia

13. **Especialidades** (`Specialties.tsx`)
    - Marcas atendidas
    - Tipos de modificações
    - Serviços populares
    - Diferenciais competitivos

## 🎨 Design System

### Cores
- Primária: `hsl(var(--primary))` (azul escuro)
- Secundária: `hsl(var(--secondary))` (azul claro)
- Background: `hsl(var(--background))` (bege claro)
- Texto: `hsl(var(--foreground))`
- Gradientes: `bg-gradient-to-r from-[#063E65] to-[#1F9AF3]`
- Variáveis CSS para temas claro/escuro

### Componentes
- Cards com sombras suaves
- Inputs com ícones
- Tooltips informativos
- Botões com estados hover/active
- Animações de transição
- Barra de progresso animada

### Animações
- Entrada de seções com fade e slide
- Transições suaves entre etapas
- Feedback visual em interações
- Carregamento com spinner

## 📱 Responsividade

O layout é responsivo e se adapta a diferentes tamanhos de tela:
- Desktop: Layout completo
- Tablet: Ajustes de grid
- Mobile: Empilhamento de elementos

## 🔒 Validação de Dados

Cada seção possui validações específicas usando Zod:
- Campos obrigatórios
- Formatos específicos (CNPJ, CEP, etc.)
- Limites de caracteres
- Validações customizadas
- Feedback visual de erros

## 🧪 Recursos de Desenvolvimento

### Modo Admin
- Botão "Preencher Teste" para dados automáticos
- Dados de exemplo para cada seção
- Preview de serviços cadastrados
- Facilita o desenvolvimento e testes

### Feedback
- Toast notifications para ações
- Mensagens de erro claras
- Indicadores de carregamento

## 📂 Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/          # Componentes shadcn/ui
│   └── business/    # Componentes específicos
│       ├── CapacityChart.tsx
│       ├── DaySchedule.tsx
│       └── WeeklySchedule.tsx
├── pages/           # Seções do formulário
├── lib/            
│   ├── constants.ts # Constantes e dados
│   └── utils.ts     # Funções utilitárias
├── types/          
│   └── business.ts  # Interfaces TypeScript
└── App.tsx         # Componente principal
```

## 🔄 Fluxo de Dados

1. Cada seção mantém seu próprio estado com React Hook Form
2. Dados são validados antes do envio
3. Ao avançar, dados são agregados no estado global
4. Na finalização, todos os dados são consolidados

## 🚀 Próximos Passos

1. Implementação do backend
2. Integração com banco de dados
3. Sistema de autenticação
4. Testes automatizados
5. Documentação de API
6. Deploy em produção

## 💡 Boas Práticas

- Código tipado com TypeScript
- Componentização lógica
- Reutilização de código
- Validações robustas
- UX/UI consistente
- Feedback claro ao usuário
- Código limpo e documentado

## 🤝 Contribuição

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`
4. Faça suas alterações
5. Teste localmente
6. Envie um pull request

## 📝 Notas de Desenvolvimento

- Manter consistência no estilo de código
- Seguir padrões estabelecidos
- Documentar alterações significativas
- Testar em diferentes cenários
- Considerar a experiência do usuário
- Manter o código limpo e organizado