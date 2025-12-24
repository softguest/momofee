import Link from 'next/link';
import React from 'react'

const AdminPage = () => {
    const steps = [
        "Schools are onboarded and trained",
        "Fee structures are configured",
        "Parents & students pay digitally",
        "Schools track payments in realtime",
    ];

  return (
    <section className="bg-primary py-20 text-white">
      <div className="px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">How It Works</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Link href="" key={i} className='pointer-curcel'>
                 <div
                    
                    className="rounded-xl bg-white/10 p-6 text-center"
                    >
                    <div className="mb-4 text-accent text-4xl font-bold">
                        {i + 1}
                    </div>
                    <p>{s}</p>
                </div>
            </Link>
           
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminPage