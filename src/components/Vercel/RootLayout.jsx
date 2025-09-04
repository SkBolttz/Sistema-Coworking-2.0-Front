import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <>
      <h1>Hello</h1>
      <Analytics />
    </>
  );
}
