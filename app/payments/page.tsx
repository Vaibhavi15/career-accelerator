"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"

interface PlanFeature {
  feature: string
  included: boolean
}

interface PricingPlan {
  name: string
  price: string
  color: string
  hoverColor: string
  textColor: string
  link: string
  features: PlanFeature[]
}

const plans: PricingPlan[] = [
  {
    name: "Explorer",
    price: "1,499",
    color: "bg-[#6366F1]",
    hoverColor: "hover:bg-[#6366F1]/90",
    textColor: "text-[#6366F1]",
    link: "https://rzp.io/rzp/fKp1PsZD",
    features: [
      {
        feature: "Comprehensive Psychometric Test (Aptitude, Personality & Interest Assessment)",
        included: true,
      },
      {
        feature: "Personalized and detailed 34-page Career Report with top 5 career recommendations",
        included: true,
      },
      {
        feature: "Career Exploration Session with a certified counselor",
        included: false,
      },
      {
        feature: "Actionable guidance on subject selection and career pathways",
        included: false,
      },
      {
        feature: "Access to our signature Career Exploration Graph with career insights and earning potential",
        included: false,
      },
      {
        feature: "Personalized Career Roadmap",
        included: false,
      },
    ],
  },
  {
    name: "Achiever",
    price: "4,999",
    color: "bg-[#9333EA]",
    hoverColor: "hover:bg-[#9333EA]/90",
    textColor: "text-[#9333EA]",
    link: "https://rzp.io/rzp/kQw7uW92",
    features: [
      {
        feature: "Comprehensive Psychometric Test (Aptitude, Personality & Interest Assessment)",
        included: true,
      },
      {
        feature: "Personalized and detailed 34-page Career Report with top 5 career recommendations",
        included: true,
      },
      {
        feature: "2 x Career Exploration Session with a certified counselor",
        included: true,
      },
      {
        feature: "Actionable guidance on subject selection and career pathways",
        included: true,
      },
      {
        feature: "Access to our signature Career Exploration Graph with career insights and earning potential",
        included: true,
      },
      {
        feature: "Assistance in developing a personalized Career Roadmap with short-term and long-term goals",
        included: true,
      },
    ],
  },
]

export default function PaymentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [paymentDone, setPaymentDone] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkPaymentStatus() {
      if (user) {
        const { data, error } = await supabase.from("profiles").select("payment_done").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching payment status:", error)
          return
        }

        setPaymentDone(data.payment_done)

        if (data.payment_done) {
          router.push("/")
        }
      }
    }

    if (!loading) {
      if (!user) {
        router.push("/login")
      } else {
        checkPaymentStatus()
      }
    }
  }, [user, loading, router])

  if (loading || paymentDone === null) {
    return null
  }

  if (paymentDone) {
    return null
  }

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Career Journey</h1>
          <p className="text-lg text-gray-400">
            Select the plan that best fits your needs and start your journey towards a fulfilling career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-baseline justify-center space-x-2">
                  <span className="text-xl">Career</span>{" "}
                  <span className={`text-2xl font-bold ${plan.textColor}`}>{plan.name}</span>
                </CardTitle>
                <div className="text-center mt-4">
                  <div className="text-4xl font-bold">₹{plan.price}</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4 min-h-[400px]">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 min-h-[28px]">
                      <div className="flex-shrink-0 w-5">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <span className="text-sm text-gray-300">{feature.feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${plan.color} ${plan.hoverColor} text-white`}>
                  <a href={plan.link} target="_blank" rel="noopener noreferrer">
                    Purchase Plan
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

