import AboutSection from "@/components/component/Home/AboutSection";
import BrandsSection from "@/components/component/Home/Brands";
import Categories from "@/components/component/Home/Categories";
import CatalogSection from "@/components/component/Home/Catlog";
import SiteFooter from "@/components/component/Home/Footer";
import Hero from "@/components/component/Home/Hero";
import InfiniteGallery from "@/components/component/Home/InfiniteGallery";
import Navbar from "@/components/component/Home/Navbar";
import ScrollGallery from "@/components/component/Home/ScrollGallery";
import ShowroomSection from "@/components/component/Home/ShowroomSection";
import PageLoader from "@/components/ui/PageLoader";
import ThreeDComponent from "@/components/ThreeDComponent";

export default function Home() {
  return (
    <>
      <PageLoader />
      <div className="bg-background">
        <Navbar />
        <Hero />
        <InfiniteGallery/>
        <Categories />
        <AboutSection />
        <ScrollGallery/>
        <ThreeDComponent />
        <BrandsSection />
        <CatalogSection />
        <ShowroomSection />
        <SiteFooter/>
      </div>
    </>
  );
}