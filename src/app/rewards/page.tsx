'use client'

import Navbar from '@/components/kopisto/Navbar'
import ParentCorner from '@/components/kopisto/ParentCorner'
import Footer from '@/components/kopisto/Footer'

export default function RewardsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sky-50 relative overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-20">
        <ParentCorner />
      </main>
      <Footer />
    </div>
  )
}
