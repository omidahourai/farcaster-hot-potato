import { Metadata } from "next";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Attest - Farcaster Frames v2 Demo",
  description: "Attest to a smart contract using Farcaster Frames",
  openGraph: {
    title: "Attest - Farcaster Frames v2 Demo",
    description: "Attest to a smart contract using Farcaster Frames",
  },
  other: {
    // Farcaster Frame metadata
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://frames-v2-demo.vercel.app/api/og?title=Attest',
    'fc:frame:button:1': 'Connect Wallet',
    'fc:frame:button:1:action': 'post',
    'fc:frame:post_url': 'https://frames-v2-demo.vercel.app/api/attest',
  },
};
