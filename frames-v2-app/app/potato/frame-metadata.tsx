import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hot Potato Game",
  description: "A fun hot potato game where you bounce the potato to avoid the fire!",
  openGraph: {
    title: "Hot Potato Game",
    description: "A fun hot potato game where you bounce the potato to avoid the fire!",
    images: ["/potato-preview.png"], // Make sure to add this image to your public folder
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": process.env.NEXT_PUBLIC_HOST 
      ? `${process.env.NEXT_PUBLIC_HOST}/potato-preview.png` 
      : "https://your-deployment-url.com/potato-preview.png", // Update with your actual deployment URL
    "fc:frame:post_url": process.env.NEXT_PUBLIC_HOST 
      ? `${process.env.NEXT_PUBLIC_HOST}/api/potato/frame` 
      : "https://your-deployment-url.com/api/potato/frame", // Update with your actual deployment URL
    "fc:frame:button:1": "Play Hot Potato",
    "fc:frame:button:1:action": "post",
  },
};
