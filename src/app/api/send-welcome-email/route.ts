
import { sendWelcomeEmail } from "@/ai/flows/send-welcome-email";
import {NextRequest, NextResponse} from 'next/server';

// By default, this is a serverless function, which can have a long cold start.
// We can configure a minimum number of instances to keep warm.
export const minInstances = 0;

// The welcome email generation can take a while, so we need to increase the timeout.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const {name, email} = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        {error: 'Missing name or email'},
        {status: 400}
      );
    }
    
    // The AI call is awaited here, inside the background serverless function.
    const result = await sendWelcomeEmail({name, email});

    if (result.success) {
      return NextResponse.json({message: result.message});
    } else {
      return NextResponse.json({error: result.message}, {status: 500});
    }
  } catch (err: any) {
    return NextResponse.json(
      {error: `An unexpected error occurred: ${err.message}`},
      {status: 500}
    );
  }
}

    