# 🤖 System Prompt - ProceX AI Form Development

## 🎯 Project Context

You are working on the ProceX AI form, a multi-step form application designed to collect detailed information about automotive tuning shops. The application is built with React, TypeScript, and modern web technologies.

## 🛠 Technical Stack

- React 18.3.1 with TypeScript
- Vite 5.4 for build tooling
- Tailwind CSS for styling
- shadcn/ui for base components
- Lucide React for icons
- Framer Motion for animations
- React Hook Form + Zod for form handling
- Recharts for data visualization

## 📋 Form Structure

The form is divided into 14 main sections:

1. Basic Info (Company details)
2. Business Hours
3. Service Capacity
4. Content Production
5. Raffles
6. Business Objectives
7. Services
8. Target Audience
9. Voice Tone
10. Scheduling Process
11. Business Rules
12. Service Policies
13. Brand Personality
14. Specialties

## 💅 Design Guidelines

1. **Colors**
   - Primary: `#063E65` (dark blue)
   - Secondary: `#1F9AF3` (light blue)
   - Background: `#F3F1EC` (light beige)
   - Gradients: `from-[#063E65] to-[#1F9AF3]`

2. **Components**
   - Use shadcn/ui components as base
   - Add Lucide icons for visual elements
   - Implement Framer Motion animations
   - Ensure responsive design

3. **Layout**
   - Max width: 4xl (896px)
   - Consistent padding and spacing
   - Card-based sections
   - Progress bar at the top

## 🎨 UI/UX Patterns

1. **Forms**
   - Clear section headers
   - Helpful tooltips
   - Validation feedback
   - Loading states
   - Error handling

2. **Navigation**
   - Back/Next buttons
   - Progress indication
   - Smooth transitions

3. **Feedback**
   - Toast notifications
   - Loading spinners
   - Validation messages

## 📝 Development Guidelines

1. **Code Structure**
   - Follow TypeScript best practices
   - Use proper type definitions
   - Implement form validation with Zod
   - Keep components focused and reusable

2. **State Management**
   - Use React Hook Form for forms
   - Maintain form data in parent component
   - Handle navigation between sections
   - Preserve data between steps

3. **Validation**
   - Implement thorough field validation
   - Show clear error messages
   - Prevent form submission with errors
   - Handle edge cases

4. **Performance**
   - Optimize component rendering
   - Lazy load sections
   - Minimize re-renders
   - Handle large datasets efficiently

## 🔍 Testing Features

- "Preencher Teste" button for quick form filling
- Preview mode for services section
- Data validation checks
- Error state testing

## 🎯 Development Focus

When implementing new features or sections:

1. Maintain consistency with existing design
2. Follow established patterns
3. Ensure proper validation
4. Add helpful user guidance
5. Consider edge cases
6. Test thoroughly

## 🚀 Getting Started

1. Understand the section requirements
2. Review existing components
3. Follow the established patterns
4. Implement validation
5. Add animations
6. Test functionality

## 📚 Documentation

Keep the project documentation updated in:
- `projeto.md` for project overview
- Type definitions in `types/business.ts`
- Component documentation in code

## 🎯 Remember

- Follow TypeScript best practices
- Maintain consistent styling
- Implement proper validation
- Add helpful user guidance
- Test thoroughly
- Document changes