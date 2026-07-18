"use client";

import { useState } from "react";

import Navbar from "@/components/component/Home/Navbar";
import FullscreenMenu from "@/components/component/Home/FullscreenMenu";

import Hero from "@/components/component/Home/Hero";
import AboutSection from "@/components/component/Home/AboutSection";
import BrandsSection from "@/components/component/Home/Brands";
import Categories from "@/components/component/Home/Categories";
import CatalogSection from "@/components/component/Home/Catlog";
import InfiniteGallery from "@/components/component/Home/InfiniteGallery";
import ScrollGallery from "@/components/component/Home/ScrollGallery";
import ShowroomSection from "@/components/component/Home/ShowroomSection";
import SiteFooter from "@/components/component/Home/Footer";
import ThreeDComponent from "@/components/ThreeDComponent";
import PageLoader from "@/components/ui/PageLoader";

export default function Home() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <PageLoader />

            <div className="bg-background">

                <Navbar
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                />

                <FullscreenMenu
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                />

                <Hero />

                <InfiniteGallery />

                <Categories />

                <AboutSection />

                <ScrollGallery />

                <ThreeDComponent />

                <BrandsSection />

                <CatalogSection />

                <ShowroomSection />

                <SiteFooter />

            </div>
        </>
    );
}