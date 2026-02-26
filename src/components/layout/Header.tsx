import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, CLINIC } from "@/lib/constants";
import { AppointmentModal } from "@/components/AppointmentModal";
import logo from "@/assets/logo.png";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top contact bar */}
      <div className="hidden md:block bg-primary text-primary-foreground text-sm">
        <div className="container flex items-center justify-between py-1.5">
          <div className="flex items-center gap-4">
            <a href={`tel:${CLINIC.phones[0]}`} className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" /> {CLINIC.phones[0]}
            </a>
            <span>|</span>
            <a href={`tel:${CLINIC.phones[1]}`} className="hover:underline">{CLINIC.phones[1]}</a>
          </div>
          <div className="flex items-center gap-4">
            <span>{CLINIC.email}</span>
            <span>|</span>
            <span>{CLINIC.workingHours} ({CLINIC.workingDays})</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt={CLINIC.name} className="h-8 md:h-10 w-auto" />
            <span className="text-base md:text-lg font-display font-bold text-primary leading-tight">
              {CLINIC.shortName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-primary hover:bg-secondary ${
                  location.pathname === link.href
                    ? "text-primary bg-secondary"
                    : "text-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button onClick={() => setAppointmentOpen(true)} size="sm" className="hidden sm:flex">
              Book Appointment
            </Button>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-background">
            <nav className="container py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-secondary"
                      : "text-foreground/80 hover:text-primary hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button onClick={() => { setAppointmentOpen(true); setMobileOpen(false); }} className="mt-2">
                Book Appointment
              </Button>
            </nav>
          </div>
        )}
      </header>

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
    </>
  );
}
