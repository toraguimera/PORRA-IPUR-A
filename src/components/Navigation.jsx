import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/partidos',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill={active ? 'white' : 'none'} stroke={active ? 'white' : '#6b7280'} strokeWidth="2" className="w-6 h-6">
        <rect x="3" y="3" width="7" height="9" rx="1"/>
        <rect x="14" y="3" width="7" height="5" rx="1"/>
        <rect x="14" y="12" width="7" height="9" rx="1"/>
        <rect x="3" y="16" width="7" height="5" rx="1"/>
      </svg>
    ),
    label: 'Partidos',
  },
  {
    to: '/clasificacion',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#6b7280'} strokeWidth="2" className="w-6 h-6">
        <path d="M8 21h8M12 17v4M17 5.5A5 5 0 0 1 12 17 5 5 0 0 1 7 5.5" strokeLinecap="round"/>
        <path d="M7 5.5H4l1 3h2M17 5.5h3l-1 3h-2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Clasificación',
  },
  {
    to: '/bote',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : '#6b7280'} strokeWidth="2" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M12 6v2M12 16v2M9 9.5h1.5a1.5 1.5 0 0 1 0 3h-1a1.5 1.5 0 0 0 0 3H11M12 6v2M12 16v2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Bote',
  },
]

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border z-50">
      <div className="flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className="flex-1 flex flex-col items-center gap-1 py-3 px-2"
          >
            {({ isActive }) => (
              <>
                <div className={`transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon(isActive)}
                </div>
                <span className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {tab.label}
                </span>
                {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
