import { CLINIC } from "@/lib/constants";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${CLINIC.whatsapp}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.31 22.606c-.388 1.094-1.938 2.002-3.164 2.266-.84.178-1.938.32-5.634-1.212-4.73-1.958-7.774-6.76-8.01-7.072-.228-.312-1.904-2.536-1.904-4.836s1.204-3.432 1.632-3.902c.388-.426 1.018-.614 1.618-.614.194 0 .368.01.524.018.428.018.644.042.926.72.354.848 1.214 2.962 1.32 3.178.108.216.216.504.068.806-.14.31-.264.448-.48.692-.216.244-.422.432-.638.694-.194.228-.414.474-.178.898.236.42 1.05 1.732 2.254 2.806 1.55 1.382 2.856 1.812 3.262 2.012.314.154.688.128.932-.138.312-.34.696-.904 1.086-1.462.278-.396.628-.446.972-.302.35.138 2.216 1.046 2.596 1.236.38.194.634.288.728.45.092.16.092.928-.296 2.022z" />
      </svg>
    </a>
  );
}
