export default function TechStack() {
    const technologies = [
      { name: "Next.js 15", icon: "N" },
      { name: "OpenAI GPT-4", icon: "AI" },
      { name: "LangChain", icon: "LC" },
      { name: "Clerk", icon: "CL" },
      { name: "Stripe", icon: "S" },
      { name: "NeonDB", icon: "N" },
      { name: "ShadCN", icon: "SC" },
      { name: "Prisma", icon: "P" },
    ]
  
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium mb-6">Powered by modern technology</h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {technologies.map((tech) => (
            <div key={tech.name} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-bold">{tech.icon}</span>
              </div>
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  