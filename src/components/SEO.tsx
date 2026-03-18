import { Helmet } from "react-helmet-async";
import { CLINIC } from "@/lib/constants";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

const DEFAULT_DESCRIPTION = `${CLINIC.shortName} — Nepal's trusted fertility clinic offering IVF, IUI, and women's wellness services in Bhaktapur.`;
const DEFAULT_OG_IMAGE = "/favicon.png";

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  canonical,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${CLINIC.shortName}` : CLINIC.name;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};
