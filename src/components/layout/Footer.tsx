import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CLINIC, NAV_LINKS, SERVICES } from "@/lib/constants";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/90">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt={CLINIC.name} className="h-10 w-auto" />
              <h3 className="text-lg font-display font-bold text-background">
                {CLINIC.shortName}
              </h3>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Providing advanced fertility treatments and compassionate women's healthcare in Bhaktapur, Nepal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/60 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/60 mb-3">
              Key Services
            </h4>
            <ul className="space-y-2 text-sm text-background/70">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="hover:text-background transition-colors"
                  >
                    {s.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/60 mb-3">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{CLINIC.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <div className="flex flex-col">
                  {CLINIC.phones.map((p) => (
                    <a key={p} href={`tel:${p}`} className="hover:text-background">
                      {p}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href={`mailto:${CLINIC.email}`} className="hover:text-background">
                  {CLINIC.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{CLINIC.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-background/50">
          <span>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</span>
          <span className="mt-1 sm:mt-0">{CLINIC.address}</span>
        </div>
      </div>
    </footer>
  );
}
