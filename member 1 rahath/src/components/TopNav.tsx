import { useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import { TOP_NAV_ITEMS, type NavSectionId } from '../data/scienceCentreData';

interface TopNavProps {
  activeNav: NavSectionId;
  cadetName: string;
  onSelectNav: (itemId: NavSectionId, href: string) => void;
  onOpenProfile: () => void;
}

export function TopNav({
  activeNav,
  cadetName,
  onSelectNav,
  onOpenProfile,
}: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: NavSectionId, href: string) => {
    setMobileMenuOpen(false);
    onSelectNav(id, href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#060913]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 md:gap-8 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home', '#top');
          }}
          className="font-display text-sm sm:text-lg font-bold tracking-wide text-white whitespace-nowrap min-w-0 truncate transition-colors duration-150 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
        >
          Mission: Little Astronaut
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {TOP_NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id, item.href);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 transition-opacity duration-150 ${
                    isActive
                      ? 'bg-cyan-400 opacity-100'
                      : 'bg-slate-400 opacity-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Child-friendly Explorer Profile Action + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenProfile}
            className="inline-flex min-h-[40px] items-center gap-1.5 sm:gap-2 border border-slate-700/80 bg-[#0D1528] px-2.5 sm:px-3.5 py-2 text-xs font-semibold text-slate-100 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-cyan-400/70 hover:bg-[#131E38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 rounded-md cursor-pointer"
          >
            <User className="h-3.5 w-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
            <span className="max-w-[78px] sm:max-w-[120px] truncate">{cadetName}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-slate-800 bg-[#0C1222] text-slate-200 md:hidden rounded-md transition-colors duration-150 hover:border-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-800/80 bg-[#080D1B] px-4 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {TOP_NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-[44px] items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-[#111B33] text-cyan-300'
                      : 'text-slate-300 hover:bg-[#0D1528] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="font-mono text-[11px] text-cyan-400">Active</span>
                  )}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
