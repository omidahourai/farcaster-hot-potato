import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get the title and string from the URL query parameters
    const title = searchParams.get('title') || 'Farcaster Frames v2 Demo';
    const randomString = searchParams.get('string') || '';
    
    // Generate the OG image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #4f46e5',
              borderRadius: '16px',
              padding: '40px',
              width: '90%',
              height: '90%',
            }}
          >
            <h1 style={{ fontSize: '60px', margin: '0 0 20px 0', textAlign: 'center' }}>
              {title}
            </h1>
            {randomString && (
              <div style={{ marginTop: '20px', fontSize: '32px', color: '#a5b4fc' }}>
                Random String: {randomString}
              </div>
            )}
            <div style={{ marginTop: '40px', fontSize: '24px', opacity: 0.8 }}>
              Farcaster Frames v2 Demo
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
