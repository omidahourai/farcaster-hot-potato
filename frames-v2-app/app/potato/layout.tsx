import { ReactNode } from "react";
import { metadata as frameMetadata } from "./frame-metadata";

export const metadata = frameMetadata;

export default function PotatoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}
