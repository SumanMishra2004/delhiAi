'use server';

import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

// This local interface ensures TS looks for the snake_case properties
interface StripeSub extends Stripe.Subscription {
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subId = session.subscription as string;

        // Use DOUBLE CASTING: 'as unknown as StripeSub'
        const stripeObject = (await stripe.subscriptions.retrieve(subId)) as unknown as StripeSub;

        if (userId) {
          await prisma.subscription.create({
            data: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: stripeObject.id,
              stripePriceId: stripeObject.items.data[0]!.price.id,
              status: stripeObject.status,
              currentPeriodStart: new Date(stripeObject.current_period_start * 1000),
              currentPeriodEnd: new Date(stripeObject.current_period_end * 1000),
            },
          });

          await prisma.user.update({
            where: { id: userId },
            data: { role: 'BROKER', isVerified: true },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        // Use DOUBLE CASTING here too
        const stripeObject = event.data.object as unknown as StripeSub;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: stripeObject.id },
          data: {
            status: stripeObject.status,
            currentPeriodStart: new Date(stripeObject.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeObject.current_period_end * 1000),
            cancelAtPeriodEnd: stripeObject.cancel_at_period_end,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const stripeObject = event.data.object as unknown as StripeSub;

        const updatedDbSub = await prisma.subscription.update({
          where: { stripeSubscriptionId: stripeObject.id },
          data: { status: 'canceled' },
        });

        if (updatedDbSub) {
          await prisma.user.update({
            where: { id: updatedDbSub.userId },
            data: { role: 'OWNER' },
          });
        }
        break;
      }
    }

    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Error handling webhook:', error);
    throw error;
  }
}