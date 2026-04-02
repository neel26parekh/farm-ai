# 🤖 FarmAI Agent Rules

This project follows strict Next.js and architectural conventions. To ensure consistency and code quality, all AI agents MUST adhere to these rules:

1.  **Read the Guide**: ALWAYS read `DEVELOPMENT_GUIDE.md` before starting any new feature or refactor. It contains the core philosophy and development cycle.
2.  **Next.js App Router**: We use the modern App Router (`src/app`). DO NOT suggest `pages` directory solutions.
3.  **CSS Modules Only**: ALWAYS use `.module.css` for styling. If adding a new component `MyComponent.tsx`, create `MyComponent.module.css`. DO NOT use Tailwind CSS or inline styles unless explicitly requested.
4.  **Premium Aesthetics**: Default to high-end design. Use `framer-motion` for transitions and `lucide-react` for icons.
5.  **Prisma & Type Safety**: Use Prisma's generated types. DO NOT use `any`. If modifying the schema, provide the `prisma.schema` update first.
6.  **Contextual AI**: When working with the AI Advisor, ensure user farm settings (crop, location, acreage) are considered for personalization.
7.  **Task Flow**: Break down complex tasks into a research -> plan -> implement -> verify cycle.

---
*Refer to [README.md](README.md) for the project mission and [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for full technical context.*
