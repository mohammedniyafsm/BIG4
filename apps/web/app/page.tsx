import Header from "@/components/component/Home/Header";
import dynamicImport from "next/dynamic";

import Hero from "@/components/component/Home/Hero";
import { FeaturedProducts } from "@/components/features/products/FeaturedProducts";
import OfferCarousel from "@/components/component/Home/OfferCarousel";
import { getOffers } from "@/lib/api";
import AboutSection from "@/components/component/Home/AboutSection";
import BrandsSection from "@/components/component/Home/Brands";
import Categories from "@/components/component/Home/Categories";
import InfiniteGallery from "@/components/component/Home/InfiniteGallery";
import ScrollGallery from "@/components/component/Home/ScrollGallery";
import ShowroomSection from "@/components/component/Home/ShowroomSection";
import SiteFooter from "@/components/component/Home/Footer";
import PageLoader from "@/components/ui/PageLoader";

const ThreeDComponent = dynamicImport(
  () => import("@/components/ThreeDComponent")
);

export const revalidate = 60;

export default async function Home() {
    const { data: offers } = await getOffers();

    return (
        <>
            <PageLoader />

            <div className="bg-background">

                <Header />

                <Hero />

                <InfiniteGallery />

                <Categories />

                <OfferCarousel offers={offers} />

                <AboutSection />

                <ScrollGallery />

                <ThreeDComponent />

                <FeaturedProducts />

                <BrandsSection />

                <ShowroomSection />

                <SiteFooter bgColor="bg-black" textColor="text-white" />

            </div>
        </>
    );
}