# Documentação do Projeto Formbenga

## package.json

### Informações Gerais
- Nome do projeto: vite-react-typescript-starter
- Versão: 0.0.0
- Tipo: module (ES Modules)

### Scripts
- dev: Inicia o servidor de desenvolvimento com Vite
- build: Compila o projeto TypeScript e gera a build de produção
- lint: Executa o ESLint para análise de código
- preview: Previsualiza a build de produção localmente
- test: Executa os testes unitários

### Dependências Principais
- React 18.3.1
- React DOM 18.3.1
- Vite 5.4.8
- TypeScript 5.5.3
- TailwindCSS 3.4.13
- Radix UI Components (vários componentes UI)
- React Hook Form 7.53.0
- Zod 3.23.8 (validação de schemas)
- Recharts 2.12.7 (gráficos)
- Framer Motion 11.0.8 (animações)
- Jest 29.0.0 (testes unitários)

### Dependências de Desenvolvimento
- ESLint 9.11.1
- PostCSS 8.4.47
- Autoprefixer 10.4.20
- TailwindCSS Animate 1.0.7
- Vite React Plugin 4.3.1

## index.html

### Estrutura Básica
- Ponto de entrada principal do projeto
- Contém a div root onde o React será renderizado
- Configurações básicas de meta tags e título
- Importação do arquivo CSS principal

### Características Principais
- Uso de módulos ES (type="module")
- Configuração do viewport para responsividade
- Link para o favicon
- Importação do arquivo main.tsx como ponto de entrada do React

## package-lock.json

### Propósito
- Arquivo gerado automaticamente pelo npm
- Contém a árvore de dependências exata instalada
- Garante builds reproduzíveis
- Não deve ser editado manualmente

## postcss.config.js

### Configuração
- Exporta configuração do PostCSS
- Utiliza o plugin autoprefixer
- Configurado para trabalhar com TailwindCSS

### Plugins
- tailwindcss: Processa classes do Tailwind
- autoprefixer: Adiciona prefixos vendor automaticamente

## tailwind.config.js

### Configuração Principal
- Extende o tema padrão do Tailwind
- Configura cores personalizadas
- Define breakpoints para responsividade
- Configura fontes e espaçamentos

### Plugins Adicionais
- @tailwindcss/forms: Estilização de formulários
- @tailwindcss/typography: Estilos para conteúdo markdown
- @tailwindcss/aspect-ratio: Controle de proporções
- @tailwindcss/line-clamp: Limitação de linhas de texto

### Conteúdo
- Configurações de dark mode
- Extensões de classes utilitárias
- Configurações de animações

## vite.config.ts

### Configuração Principal
- Define o ambiente de desenvolvimento com Vite
- Configura o plugin React para TypeScript
- Define aliases para caminhos de importação

### Plugins
- @vitejs/plugin-react: Suporte ao React com Fast Refresh
- vite-plugin-svgr: Importação de SVGs como componentes React
- vite-plugin-checker: Verificação de tipos TypeScript em tempo real

### Otimizações
- Configuração de build para produção
- Divisão de código (code splitting)
- Minificação de assets
- Geração de source maps

### Aliases
- @ → src/
- @components → src/components/
- @pages → src/pages/
- @lib → src/lib/
- @hooks → src/hooks/
- @types → src/types/

## .gitignore

### Propósito
- Arquivo de configuração do Git
- Especifica arquivos e diretórios que devem ser ignorados no versionamento

### Conteúdo Principal
- Ignora logs e arquivos de debug
- Exclui node_modules e diretórios de build
- Ignora arquivos específicos de IDEs e editores
- Exclui arquivos temporários e de configuração local
