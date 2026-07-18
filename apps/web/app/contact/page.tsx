"use client";

import { useState } from "react";
import ContactForm from "@/components/component/Contact/ContactForm";
import FullscreenMenu from "@/components/component/Home/FullscreenMenu";
import Navbar from "@/components/component/Home/Navbar";
import PageLoader from "@/components/ui/PageLoader";

export default function ContactPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <PageLoader />
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <FullscreenMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <ContactForm />
        </>
    );
}