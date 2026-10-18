import { site } from '../config/site';
import { absoluteUrl } from './urls';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    description: site.description,
    logo: absoluteUrl('/brand/logo.svg'),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
  };
}

export function quizSchema(opts: {
  name: string;
  description: string;
  url: string;
  educationalLevel: string;
  numberOfQuestions?: number;
  isBasedOn?: string;
  about?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    educationalLevel: opts.educationalLevel,
    learningResourceType: 'Quiz',
    inLanguage: site.locale,
    numberOfQuestions: opts.numberOfQuestions ?? site.examRules.questionCount,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
  };
  if (opts.isBasedOn) schema.isBasedOn = opts.isBasedOn;
  if (opts.about) schema.about = opts.about;
  return schema;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}
