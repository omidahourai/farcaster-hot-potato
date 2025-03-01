import { NextRequest, NextResponse } from 'next/server';

// This is the API route that will handle frame requests
export async function GET(req: NextRequest) {
  // Get the host from the request
  const host = req.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // Create the frame metadata
  const frameMetadata = {
    frame: {
      version: '1',
      image: `${baseUrl}/api/og?title=Attest`,
      buttons: [
        {
          label: 'Connect Wallet',
          action: 'post',
        },
        {
          label: 'View Attestation Page',
          action: 'link',
          target: `${baseUrl}/attest`,
        },
      ],
      postUrl: `${baseUrl}/api/attest`,
    },
    title: 'Attest - Farcaster Frames v2 Demo',
    description: 'Attest to a smart contract using Farcaster Frames',
    ogImage: `${baseUrl}/api/og?title=Attest`,
  };

  // Generate the HTML with the frame metadata
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${frameMetadata.title}</title>
        <meta property="og:title" content="${frameMetadata.title}" />
        <meta property="og:description" content="${frameMetadata.description}" />
        <meta property="og:image" content="${frameMetadata.ogImage}" />
        <meta property="fc:frame" content="${frameMetadata.frame.version}" />
        <meta property="fc:frame:image" content="${frameMetadata.frame.image}" />
        <meta property="fc:frame:button:1" content="${frameMetadata.frame.buttons[0].label}" />
        <meta property="fc:frame:button:1:action" content="${frameMetadata.frame.buttons[0].action}" />
        <meta property="fc:frame:button:2" content="${frameMetadata.frame.buttons[1].label}" />
        <meta property="fc:frame:button:2:action" content="${frameMetadata.frame.buttons[1].action}" />
        <meta property="fc:frame:button:2:target" content="${frameMetadata.frame.buttons[1].target}" />
        <meta property="fc:frame:post_url" content="${frameMetadata.frame.postUrl}" />
      </head>
      <body>
        <h1>${frameMetadata.title}</h1>
        <p>${frameMetadata.description}</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// Handle POST requests from the frame
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    await req.json();
    
    // Generate a random 12-character string
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < 12; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Get the host from the request
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create the response frame metadata
    const frameMetadata = {
      frame: {
        version: '1',
        image: `${baseUrl}/api/og?title=Attest&string=${randomString}`,
        buttons: [
          {
            label: 'Attest to Contract',
            action: 'post',
          },
          {
            label: 'View Attestation Page',
            action: 'link',
            target: `${baseUrl}/attest`,
          },
        ],
        postUrl: `${baseUrl}/api/attest/confirm`,
      },
    };

    // Generate the HTML with the frame metadata
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Attest - Farcaster Frames v2 Demo</title>
          <meta property="fc:frame" content="${frameMetadata.frame.version}" />
          <meta property="fc:frame:image" content="${frameMetadata.frame.image}" />
          <meta property="fc:frame:button:1" content="${frameMetadata.frame.buttons[0].label}" />
          <meta property="fc:frame:button:1:action" content="${frameMetadata.frame.buttons[0].action}" />
          <meta property="fc:frame:button:2" content="${frameMetadata.frame.buttons[1].label}" />
          <meta property="fc:frame:button:2:action" content="${frameMetadata.frame.buttons[1].action}" />
          <meta property="fc:frame:button:2:target" content="${frameMetadata.frame.buttons[1].target}" />
          <meta property="fc:frame:post_url" content="${frameMetadata.frame.postUrl}" />
          <meta property="fc:frame:state" content="${Buffer.from(JSON.stringify({ randomString })).toString('base64')}" />
        </head>
        <body>
          <h1>Attest - Farcaster Frames v2 Demo</h1>
          <p>Your random string: ${randomString}</p>
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
