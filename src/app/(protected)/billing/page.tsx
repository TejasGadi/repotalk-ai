"use client"
import { Info } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { api } from "~/trpc/react";
import Razorpay from "razorpay";
import useRefetch from "~/hooks/use-refetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BillingPage = () => {
  const { data: user } = api.project.getMyCredits.useQuery();
  const refetch = useRefetch()
  const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100]);
  const creditsToBuyAmount = creditsToBuy[0]!;
  const price = ((creditsToBuyAmount / 50) * 85).toFixed(2);

  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }
  
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Number(price) * 100, // Convert to paise
        currency: 'INR',
        credits: creditsToBuyAmount,
      }),
    });
  
    const data = await response.json();
  
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: `RepoTalk ${creditsToBuyAmount} Credits`,
      description: `Purchase of ${creditsToBuyAmount} credits`,
      order_id: data.id,
      handler: async function (response: any) {
        try {
          // Store transaction in database
          await fetch('/api/razorpay/store-transaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-razorpay-order-id': response.razorpay_order_id, // Pass the order ID
              'x-razorpay-signature': response.razorpay_signature, // Pass the signature
            },
            body: JSON.stringify({
              userId: user?.id,
              razorpayPaymentId: response.razorpay_payment_id,
              credits: creditsToBuyAmount,
            }),
          });
  
          window.location.href = '/create';
          refetch()
        } catch (error) {
          console.error("Error storing transaction:", error);
          alert("Failed to store transaction. Please contact support.");
        }
      },
      prefill: {
        email: user?.emailAddress || '',
      },
      theme: {
        color: '#2563eb',
      },
    };
  
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  

  return (
    <div>
      {
        user?.credits?(
          <>
            <h1 className="mb-2 text-xl font-semibold">Billing</h1>
              
              {/* <p className="mb-2 text-sm text-gray-500">
                You currently have {user?.credits} credits
              </p> */}
              <Card className="mb-4 border-blue-500 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium text-blue-700">Your Credits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-blue-900">{user?.credits}</div>
                    <p className="text-sm text-muted-foreground">credits available</p>
                </CardContent>
            </Card>
              <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700">
                <div className="flex items-center gap-2">
                  <Info className="size-4" />
                  <p className="text-sm">
                    Each credit allows you to index 1 file in the repository.
                  </p>
                </div>
                <p className="text-sm">
                  Example: If your project has 100 files, you require 100 credits to
                  index it.
                </p>
              </div>
              <h1 className="mt-4 text-lg font-semibold">Buy Credits</h1>
              <Slider
                defaultValue={[100]}
                max={1000}
                min={10}
                step={10}
                onValueChange={(value) => setCreditsToBuy(value)}
                value={creditsToBuy}
                className="mb-4 mt-4 cursor-pointer"
              />

              <Button
                onClick={handlePayment}
                className="mt-4"
              >
                Buy {creditsToBuyAmount} credits for Rs.{price}
              </Button>
          </>
        ):
        (
          <div className="flex h-[80vh] w-full flex-col items-center justify-center text-center">
            <div className="mt-6 mb-4 animate-pulse text-2xl font-semibold text-gray-700 dark:text-white">
              Loading your billing page...
            </div>
            <div className="h-2 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          </div>
        )
      }
      
    </div>
  );
};

export default BillingPage;
