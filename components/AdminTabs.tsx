'use client'

import { useState } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

export default function AdminTabs({ tabs }: { tabs: Tab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')

  return (
    <>
      <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={`relative font-mono text-xs uppercase tracking-widest pb-3 whitespace-nowrap transition-colors duration-200 ${
              activeId === t.id ? 'text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {t.label}
            {activeId === t.id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            )}
          </button>
        ))}
      </div>

      {tabs.map((t) => (
        <div key={t.id} className={activeId === t.id ? '' : 'hidden'}>
          {t.content}
        </div>
      ))}
    </>
  )
}
