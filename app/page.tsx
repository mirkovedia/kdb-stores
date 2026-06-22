import { Hero } from '@/components/home/Hero';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { HowItWorks } from '@/components/home/HowItWorks';
import { InstagramFeed } from '@/components/home/InstagramFeed';

export default function Home() {
  return (
    <>
      <Hero />

      <CategoriesGrid />

      <FeaturedProducts />

      <HowItWorks />

      <InstagramFeed />
    </>
  );
}
