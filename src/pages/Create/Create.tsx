import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { CreateFormData } from '../../components/CreateForm/CreateForm.types'

import CreateForm from '../../components/CreateForm/CreateForm'
import Header from '../../components/Header/Header'

const INITIAL_DATA: CreateFormData = {
  carbs: '',
  fat: '',
  ingredients: [],
  instructions: '',
  protein: '',
  tags: [],
  title: '',
}

export default function Create() {
  const navigate = useNavigate()
  const [data, setData] = useState<CreateFormData>(INITIAL_DATA)

  const handleChange = (patch: Partial<CreateFormData>) => {
    setData((prev) => ({ ...prev, ...patch }))
  }

  const handleSave = () => {
    console.log(data)
    void navigate('/meal-preps')
  }

  return (
    <div
      className="relative flex min-h-dvh flex-col overflow-hidden bg-char text-bark antialiased"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div aria-hidden="true" className="grain-overlay" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 h-175 w-175 -translate-x-1/2 translate-y-1/2 rounded-full bg-ember opacity-[0.04] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-0 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-moss opacity-[0.04] blur-[140px]"
      />

      <Header />

      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-14">
          <p className="mb-3 text-[10px] tracking-[0.35em] text-ember/50 uppercase">
            Create your own
          </p>
          <h1
            className="text-5xl font-light italic leading-[1.1] text-bark sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            New Meal Prep
          </h1>

          <CreateForm
            data={data}
            onCancel={() => { void navigate('/') }}
            onChange={handleChange}
            onSave={handleSave}
          />
        </div>
      </main>
    </div>
  )
}
