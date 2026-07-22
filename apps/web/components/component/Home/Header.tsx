"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import FullscreenMenu from "./FullscreenMenu";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <Navbar
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />
            <FullscreenMenu
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />
        </>
    );
}
