import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const idStr = segments[segments.length - 1];

    const eventId = Number(idStr);
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Convert null to undefined for optional fields to match EventSchema type
    const mappedEvent = {
      ...event,
      email: event.email ?? undefined,
      address: event.address ?? undefined,
      details: event.details ?? undefined,
      bookingBy: event.bookingBy ?? undefined,
      reference: event.reference ?? undefined,
      hallHandover: event.hallHandover ?? undefined,
      decoration: event.decoration ?? undefined,
      catering: event.catering ?? undefined,
      kitchen: event.kitchen ?? undefined,
    };

    return NextResponse.json(mappedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
