import { NextResponse } from "next/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(req: Request) {
    const { amount, currency, credits } = await req.json()
    
    try {
        const options = {
            amount: amount.toString(),
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                credits: credits.toString()
            }
        }

        const order = await razorpay.orders.create(options)
        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount
        })
    } catch (err) {
        return NextResponse.json(
            { error: 'Error creating order' },
            { status: 500 }
        )
    }
}