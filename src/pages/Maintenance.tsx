import { CLINIC } from "@/lib/constants";
import logo from "@/assets/logo.png";
import { Phone, Mail, Clock } from "lucide-react";

export const Maintenance = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary px-4 py-12 text-center">
      <div className="max-w-lg w-full">
        <img
          src={logo}
          alt={`${CLINIC.shortName} logo`}
          className="h-28 w-auto mx-auto mb-8"
        />
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Site Under Maintenance
        </h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          We are currently performing scheduled maintenance to improve our
          services. Please check back soon.
        </p>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm text-left">
          <h2 className="font-semibold text-foreground mb-4">Reach us</h2>
          <div className="space-y-3">
            <a
              href={`tel:${CLINIC.phones[0]}`}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{CLINIC.phones[0]}</span>
            </a>
            {CLINIC.phones[1] && (
              <a
                href={`tel:${CLINIC.phones[1]}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{CLINIC.phones[1]}</span>
              </a>
            )}
            <a
              href={`mailto:${CLINIC.email}`}
              className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{CLINIC.email}</span>
            </a>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {CLINIC.workingDays}, {CLINIC.workingHours}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
