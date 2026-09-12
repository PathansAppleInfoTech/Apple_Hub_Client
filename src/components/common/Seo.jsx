
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://ecom.pathansapple.com';
const SITE_NAME = 'Apple Hub';
const BRAND_NAME = 'Apple Hub by Pathans Apple Info Tech';

const DEFAULT_TITLE =
  'Apple Hub | Digital & Technology Services by Pathans Apple Info Tech';

const DEFAULT_DESCRIPTION =
  'Apple Hub by Pathans Apple Info Tech — explore and purchase professional web development, software development, digital marketing, design and IT services online.';

const DEFAULT_IMAGE = `${SITE_URL}/assets/images/logo.png`;

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  imageAlt = BRAND_NAME,
  noIndex = false,
  type = 'website',
}) {
  // Make sure paths always work correctly
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const canonicalUrl =
    normalizedPath === '/'
      ? SITE_URL
      : `${SITE_URL}${normalizedPath}`;

  const fullTitle = title
    ? `${title} | Apple Hub`
    : DEFAULT_TITLE;

  const metaDescription = description || DEFAULT_DESCRIPTION;

  const robotsContent = noIndex
    ? 'noindex, nofollow'
    : 'index, follow';

  // Convert relative image paths to absolute URLs
  const absoluteImage = image.startsWith('http')
    ? image
    : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      {/* =====================================================
          BASIC SEO
      ====================================================== */}

      <html lang="en" />

      <title>{fullTitle}</title>

      <meta
        name="description"
        content={metaDescription}
      />

      <meta
        name="robots"
        content={robotsContent}
      />

      <meta
        name="googlebot"
        content={robotsContent}
      />

      <meta
        name="author"
        content="Pathans Apple Info Tech"
      />

      <meta
        name="theme-color"
        content="#ffffff"
      />

      <meta
        name="color-scheme"
        content="light"
      />

      {/* Canonical */}
      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* =====================================================
          FAVICON
      ====================================================== */}

      <link
        rel="icon"
        type="image/png"
        href="/assets/images/logo.png"
      />

      <link
        rel="apple-touch-icon"
        href="/assets/images/logo.png"
      />

      {/* =====================================================
          OPEN GRAPH
          Facebook / WhatsApp / LinkedIn
      ====================================================== */}

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:title"
        content={fullTitle}
      />

      <meta
        property="og:description"
        content={metaDescription}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content={BRAND_NAME}
      />

      <meta
        property="og:locale"
        content="en_IN"
      />

      <meta
        property="og:image"
        content={absoluteImage}
      />

      <meta
        property="og:image:alt"
        content={imageAlt}
      />

      <meta
        property="og:image:type"
        content="image/png"
      />

      {/* =====================================================
          TWITTER / X
      ====================================================== */}

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={fullTitle}
      />

      <meta
        name="twitter:description"
        content={metaDescription}
      />

      <meta
        name="twitter:image"
        content={absoluteImage}
      />

      <meta
        name="twitter:image:alt"
        content={imageAlt}
      />

      {/* =====================================================
          ORGANIZATION STRUCTURED DATA
      ====================================================== */}

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          alternateName: BRAND_NAME,
          url: SITE_URL,
          logo: DEFAULT_IMAGE,
          description: DEFAULT_DESCRIPTION,
          parentOrganization: {
            '@type': 'Organization',
            name: 'Pathans Apple Info Tech',
          },
        })}
      </script>

      {/* =====================================================
          WEBSITE STRUCTURED DATA
      ====================================================== */}

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          alternateName: BRAND_NAME,
          url: SITE_URL,
          description: DEFAULT_DESCRIPTION,
        })}
      </script>
    </Helmet>
  );
}
