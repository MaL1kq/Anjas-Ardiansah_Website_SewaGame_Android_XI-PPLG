// components/layout/Navbar.tsx
import { getSession } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

// Server component — baca session di server, kirim ke client
export default async function Navbar() {
  const session = await getSession();
  return <NavbarClient session={session} />;
}