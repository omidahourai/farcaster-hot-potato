import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests for the confirmation step
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    
    // Get the state from the request (contains the random string)
    const state = body.state ? JSON.parse(Buffer.from(body.state, 'base64').toString()) : {};
    const { randomString } = state;

    // Get the host from the request
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create the response frame metadata
    const frameMetadata = {
      frame: {
        version: '1',
        image: `${baseUrl}/api/og?title=Success&string=${randomString}`,
        buttons: [
          {
            label: 'Start Over',
            action: 'post',
            target: `${baseUrl}/api/attest`,
          },
          {
            label: 'View Attestation Page',
            action: 'link',
            target: `${baseUrl}/attest`,
          },
        ],
      },
    };

    // Generate the HTML with the frame metadata
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Attestation Successful - Farcaster Frames v2 Demo</title>
          <meta property="fc:frame" content="${frameMetadata.frame.version}" />
          <meta property="fc:frame:image" content="${frameMetadata.frame.image}" />
          <meta property="fc:frame:button:1" content="${frameMetadata.frame.buttons[0].label}" />
          <meta property="fc:frame:button:1:action" content="${frameMetadata.frame.buttons[0].action}" />
          <meta property="fc:frame:button:1:target" content="${frameMetadata.frame.buttons[0].target}" />
          <meta property="fc:frame:button:2" content="${frameMetadata.frame.buttons[1].label}" />
          <meta property="fc:frame:button:2:action" content="${frameMetadata.frame.buttons[1].action}" />
          <meta property="fc:frame:button:2:target" content="${frameMetadata.frame.buttons[1].target}" />
        </head>
        <body>
          <h1>Attestation Successful!</h1>
          <p>Your random string: ${randomString}</p>
          <p>Your attestation has been recorded on the blockchain.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error processing frame request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
