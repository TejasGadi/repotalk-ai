import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { db } from "~/server/db";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(req: Request) {
    const {
        userId,
        razorpayPaymentId,
        credits
    } = await req.json();

    const razorpay_order_id = req.headers.get('x-razorpay-order-id');
    const razorpay_signature = req.headers.get('x-razorpay-signature');

    if (!razorpay_order_id || !razorpay_signature) {
        return NextResponse.json({
            success: false,
            error: 'Missing Razorpay order ID or signature'
        }, {
            status: 400
        });
    }

    const body = razorpay_order_id + "|" + razorpayPaymentId;
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

        if (!isValidSignature) {
            return NextResponse.json({
                success: false,
                error: 'Invalid Razorpay signature'
            }, {
                status: 400
            });
        }

        const transaction = await db.razorpayTransaction.create({
            data: {
                userId,
                razorpayPaymentId,
                credits,
            },
        });

        // Update user's credits in the database (assuming a User model exists)
        await db.user.update({
            where: {
                id: userId
            },
            data: {
                credits: {
                    increment: credits
                }
            },
        });

        return NextResponse.json({
            success: true,
            transaction
        });
    } catch (error) {
        console.error("Error storing transaction:", error);
        return NextResponse.json({
            success: false,
            error: error
        }, {
            status: 500
        });
    }
}
