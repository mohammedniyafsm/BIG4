"use client";

import { useState } from "react";
import Exper from "@/components/component/About/Exper";
import Experinces from "@/components/component/About/Experince";
import Hero from "@/components/component/About/Hero";
import TimelineGallery from "@/components/component/About/TimelineGallery";
import SiteFooter from "@/components/component/Home/Footer";
import FullscreenMenu from "@/components/component/Home/FullscreenMenu";
import Navbar from "@/components/component/Home/Navbar";
import PageLoader from "@/components/ui/PageLoader";



export default function ABoutPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <PageLoader />
            <div className="">
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <FullscreenMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <div className="bg-[#1e1f22] min-w-screen min-h-screen">
                    <Hero />
                    <Experinces />
                    <TimelineGallery />
                    <Exper />
                    <SiteFooter />
                </div>
            </div>
        </>
    );
}