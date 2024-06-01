/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'a0.muscache.com',
      'avatars.dicebear.com',
      'upcdn.io',
      't4.ftcdn.net',
    ],
  },
  i18n: {
    locales: ['en', 'ua'],
    defaultLocale: 'en',
  },
}

export default nextConfig
