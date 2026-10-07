"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function GlobalWrapper({ 
  children, 
  footer 
}: { 
  children: React.ReactNode, 
  footer: React.ReactNode 
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <div className="flex-grow">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-grow pt-24">
        {children}
      </div>
      {footer}
    </>
  );
}
