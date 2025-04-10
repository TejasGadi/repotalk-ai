"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqAccordion() {
  const faqs = [
    {
      question: "What is RepoTalk AI and how does it work?",
      answer:
        "RepoTalk AI is a full-stack AI-powered GitHub assistant that connects to your repositories to provide instant, intelligent answers about your codebase. It uses OpenAI embeddings and language models to understand and retrieve relevant information using a RAG (Retrieval-Augmented Generation) pipeline.",
    },
    {
      question: "How do credits work in RepoTalk AI?",
      answer:
        "You start with 150 free credits. Each file processed from a repository consumes 1 credit. It's a pay-as-you-go model—no subscriptions or monthly fees. Credits are only used when you upload or reprocess repositories.",
    },
    {
      question: "Can I connect private GitHub repositories?",
      answer:
        "Absolutely. RepoTalk AI uses secure GitHub OAuth integration to authorize access to both public and private repositories.",
    },
    {
      question: "What types of questions can I ask the AI?",
      answer:
        "You can ask things like: 'What does this function do?', 'Where is this class defined?', or 'Explain this component logic'. RepoTalk AI analyzes your code contextually and gives smart, developer-friendly responses.",
    },
    {
      question: "Can I invite my teammates to collaborate?",
      answer:
        "Yes. You can invite teammates to a project. Collaborators can ask questions, view code insights, and contribute to shared repo understanding. Permissions are managed from your dashboard.",
    },
    {
      question: "Do I need to pay to use RepoTalk AI?",
      answer:
        "Nope. You get 150 AI credits completely free to start. No credit card required. You can use these to upload repos and interact with your code through AI.",
    },
    {
      question: "What AI models does RepoTalk AI use?",
      answer:
        "RepoTalk AI uses OpenAI models for both text embeddings and chat-based interactions(specifically gpt-4o model).",
    },
    {
      question: "Where is RepoTalk AI deployed and how is it managed?",
      answer:
        "RepoTalk AI is deployed on Vercel for seamless CI/CD. It uses Clerk for auth, NeonDB for database, Stripe for billing, and is built with Next.js 15 and Shadcn for the UI.",
    },
  ]
  

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
