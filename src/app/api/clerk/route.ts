import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env",
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, return an error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", { status: 400 });
  }

  // Extract user data
  const { type, data } = evt;
  if (type === "user.created" || type === "user.updated") {
    try {
      await db.user.upsert({
        where: { emailAddress: data.email_addresses[0]?.email_address ?? "" },
        update: {
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
        },
        create: {
          id: data.id,
          emailAddress: data.email_addresses[0]?.email_address ?? "",
          imageUrl: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        },
      });
      console.log(`User ${type} event processed for ID: ${data.id}`);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return new Response("Error: Database operation failed", { status: 500 });
    }
  } else {
    console.log(`Unhandled event type: ${type}`);
  }

  return new Response("Webhook received", { status: 200 });
}
