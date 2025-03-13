'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (isAuthenticated === "true") {
        router.push('/ticket');
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  return (
    <>
    </>
  )
}