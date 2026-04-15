import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://gladtidingshealth.org', lastModified: new Date() },
    { url: 'https://gladtidingshealth.org/shop', lastModified: new Date() },
    { url: 'https://gladtidingshealth.org/about', lastModified: new Date() },
    { url: 'https://gladtidingshealth.org/blog', lastModified: new Date() },
    { url: 'https://gladtidingshealth.org/contact', lastModified: new Date() },
  ]
}
