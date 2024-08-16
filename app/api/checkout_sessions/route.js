import { NextResponse } from "next/server"
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100)
}

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const session_id = searchParams.get('session_id')

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
        return NextResponse.json(checkoutSession)
    } catch (error) {
        console.error('Error retrieving checkout session:', error)
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}
export async function POST(req) {
    try {
        const origin = req.headers.get('origin') || 'http://localhost:3000';
        const type = req.headers.get('type')
        const name = type === 'pro' ? 'Pro Subscription' : 'Basic Subscription'
        const price = type === 'pro' ? 10 : 5

        const params = {
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name,
                        },
                        unit_amount: formatAmountForStripe(price),
                        recurring: {
                            interval: 'month',
                            interval_count: 1,
                        }
                    },
                    quantity: 1,
                }
            ],
            success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/`,
        }
        const checkoutSession = await stripe.checkout.sessions.create(params)

        return NextResponse.json(checkoutSession, {
            status: 200,
        })
    } catch (error) {
        console.error('Error creating checkout session:', error)
        return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
            status: 500,
        })
    }
}