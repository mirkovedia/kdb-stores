import { Hero } from '@/components/home/Hero';
import { TickerMarquee } from '@/components/home/TickerMarquee';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InstagramFeed } from '@/components/home/InstagramFeed';

export default function Home() {
  return (
    <>
      <Hero />

      <TickerMarquee />

      <CategoriesGrid />

      <FeaturedProducts />

      <BrandMarquee />

      <HowItWorks />

      <InstagramFeed />
    </>
  );
}
