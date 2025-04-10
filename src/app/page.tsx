"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, MessageSquare, GitCommit, Search, Shield, Users, CreditCard } from "lucide-react"
import Navbar from "@/components/navbar"
import FeatureCard from "@/components/feature-card"
import PricingTable from "@/components/pricing-table"
import FaqAccordion from "@/components/faq-accordion"
import TechStack from "@/components/tech-stack"
import Footer from "@/components/footer"
import { useUser } from "@clerk/nextjs"
import { useAuth } from "@clerk/clerk-react"
import { redirect } from "next/navigation"

export default function Home() {
  const user = useAuth()

  if(user.isSignedIn){
    return redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden w-full flex flex-col items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background z-0"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Now in public beta
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Understand your codebase with <span className="text-primary">AI-powered</span> insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              RepoTalk AI helps developers deeply understand their codebase, collaborate with their team, and get
              instant answers from their own repository.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="gap-2" onClick={()=>{
                redirect("/sign-up")
              }}>
                Start for Free <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 w-full flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Development Workflow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              RepoTalk AI integrates seamlessly with GitHub to provide powerful features that help you understand and
              navigate your codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageSquare />}
              title="Ask AI Anything"
              description="Chat with your GitHub repository and get context-aware answers using OpenAI GPT-4 and LangChain embeddings."
            />
            <FeatureCard
              icon={<GitCommit />}
              title="Commit History Insights"
              description="Visualize and search commit logs with smart summaries to understand how your codebase has evolved."
            />
            <FeatureCard
              icon={<Search />}
              title="Code Understanding Powered by RAG"
              description="Index and embed your repo with vector search for instant, accurate responses to your questions."
            />
            <FeatureCard
              icon={<Shield />}
              title="Secure & Private"
              description="Your code is processed securely – we use vector databases and only store what's needed to provide our service."
            />
            <FeatureCard
              icon={<Users />}
              title="Team Collaboration"
              description="Invite team members to shared projects and collaborate effectively on your codebase."
            />
            <FeatureCard
              icon={<CreditCard />}
              title="Stripe Payments"
              description="Simple credit-based pricing. Pay only for what you use with our flexible payment options."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 w-full flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How RepoTalk AI Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI technology makes understanding your codebase simple and intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Connect Your Repository</h3>
                    <p className="text-muted-foreground">
                      Link your GitHub repository to RepoTalk AI with just a few clicks.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI Indexes Your Code</h3>
                    <p className="text-muted-foreground">
                      Our system analyzes and embeds your codebase using LangChain and vector databases.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ask Questions & Get Answers</h3>
                    <p className="text-muted-foreground">
                      Chat with your codebase using natural language and receive context-aware responses using Retrieval Augemented Generation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/50 w-full flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what developers are saying about their experience with RepoTalk AI.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 w-full flex flex-col items-center" id="pricing">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Pay only for what you use with our credit-based system. No hidden fees or surprises.
            </p>
          </div>

          <PricingTable />

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">All plans include:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Unlimited repositories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Team collaboration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Regular updates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/50 w-full flex flex-col items-center">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about RepoTalk AI.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 border-t">
        <div className="container px-4 md:px-6">
          <TechStack />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
