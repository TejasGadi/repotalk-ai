"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { redirect } from "next/navigation"

export default function PricingTable() {
  const plan = {
    name: "Pay-as-you-go",
    description:
      "Get started with 150 free AI credits. Use credits to analyze your code repositories. Only pay when you need more.",
    features: [
      "150 AI credits included for free",
      "1 credit = 1 file processed from your repo",
      "No upfront subscription or monthly fees",
      "Unlimited repositories",
      "Basic commit history insights",
      "Email support",
    ],
    cta: "Start Free",
  }

  return (
    <div className="max-w-xl mx-auto rounded-lg border bg-background p-6 shadow-md">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </div>
      <ul className="mb-6 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" onClick={()=>{return redirect("/sign-up")}}>{plan.cta}</Button>
    </div>
  )
}
