import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";

interface ClerkUserEvent {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses?: { id: string; email_address: string }[];
    primary_email_address_id?: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    deleted?: boolean;
  };
}

/**
 * Keeps the local `User` table in sync with Clerk, so Prisma-backed features
 * (crates, set plans, saved tracks — once those stores migrate off
 * localStorage, see the Milestone 9 README note) can foreign-key against a
 * real user row instead of a bare Clerk ID string.
 *
 * Configure this in the Clerk dashboard: Webhooks → Add Endpoint →
 * https://yourdomain.com/api/webhooks/clerk, subscribed to user.created,
 * user.updated, user.deleted. Copy the signing secret into
 * CLERK_WEBHOOK_SECRET in .env.local.
 */
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }
  if (!prisma) {
    return NextResponse.json({ error: "No database configured" }, { status: 500 });
  }

  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  let event: ClerkUserEvent;

  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch (err) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } =
    event.data;

  if (event.type === "user.deleted") {
    await prisma.user.delete({ where: { id } }).catch(() => {
      // Already gone — nothing to do.
    });
    return NextResponse.json({ ok: true });
  }

  const primaryEmail =
    email_addresses?.find((e) => e.id === primary_email_address_id)?.email_address ??
    email_addresses?.[0]?.email_address;

  if (!primaryEmail) {
    return NextResponse.json({ error: "No email address on user event" }, { status: 400 });
  }

  await prisma.user.upsert({
    where: { id },
    update: {
      email: primaryEmail,
      firstName: first_name ?? null,
      lastName: last_name ?? null,
      imageUrl: image_url ?? null,
    },
    create: {
      id,
      email: primaryEmail,
      firstName: first_name ?? null,
      lastName: last_name ?? null,
      imageUrl: image_url ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
