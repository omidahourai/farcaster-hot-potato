import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Attest - Farcaster Frames v2 Demo';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
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
            Attest
          </h1>
          <div style={{ marginTop: '40px', fontSize: '24px', opacity: 0.8 }}>
            Farcaster Frames v2 Demo
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
