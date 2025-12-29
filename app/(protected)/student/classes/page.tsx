import React from 'react'
import ClassesClient from "./ClassesClient"

const ClassPage = () => {
  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className="max-w-5xl mx-auto text-2xl font-bold mb-8">My Class</h1>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            Student Class Details
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>

      <ClassesClient />
    </div>
  )
}

export default ClassPage;