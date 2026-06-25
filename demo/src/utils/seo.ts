type MetaAttributes = {
  name?: string;
  property?: string;
  content: string;
};

const ensureMeta = (selector: string, attrs: MetaAttributes) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    if (attrs.name) element.setAttribute('name', attrs.name);
    if (attrs.property) element.setAttribute('property', attrs.property);
    document.head.appendChild(element);
  }

  element.setAttribute('content', attrs.content);
};

const ensureLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const ensureJsonLd = (id: string, value: Record<string, any>) => {
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(value);
};

export function setSeo(options: {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
}) {
  const { title, description, path = '/', keywords, jsonLd } = options;
  const canonical = `${window.location.origin}${path}`;

  document.title = title;
  ensureMeta('meta[name="description"]', { name: 'description', content: description });
  if (keywords) {
    ensureMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
  }
  ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  ensureMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: description,
  });
  ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  ensureMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  ensureMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: description,
  });
  ensureLink('canonical', canonical);

  if (jsonLd) {
    ensureJsonLd('easy-email-seo-jsonld', jsonLd);
  }
}
