import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex h-16 sm:h-20 lg:h-24 items-center justify-between px-6 sm:px-6 lg:px-10 xl:px-16 py-12 lg:py-20">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={160}
            height={50}
            className="h-12 w-auto sm:h-12 lg:h-14 xl:h-14 cursor-pointer"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">

          <div className="flex items-center gap-8 xl:gap-8">

            <NavLink title="Home" href="/" />

            <NavLink title="About" href="/about" />

            <NavLink title="Brands" href="/brands" />

            <NavLink title="Contact" href="/contact" />

            <Link
              href="/catalog"
              className="
                cursor-pointer
                border
                border-white
                bg-white
                px-4
                py-2.5
                text-[8px]
                font-semibold
                uppercase
                text-black
                transition-all
                duration-300
                ease-in-out
                hover:bg-black
                hover:text-white
                hover:border-black
              "
            >
              Catalog
            </Link>

          </div>

          <div className="ml-14 flex items-center gap-20">

            <Image
              src="/677276fd561b48d392692df4_burger-icon.svg"
              alt="Menu"
              width={42}
              height={42}
              className="h-10 w-10 xl:h-10 xl:w-10 pb-3 cursor-pointer"
            />

          </div>

        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 sm:gap-5 lg:hidden">

          <Link
            href="/catalog"
            className="
              cursor-pointer
              border
              border-white
              bg-white
              px-3
              py-2
              sm:px-5
              sm:py-2.5
              text-[8px]
              font-semibold
              uppercase
              text-black
              transition-all
              duration-300
              ease-in-out
              hover:bg-black
              hover:text-white
              hover:border-black
            "
          >
            Catalog
          </Link>

          <Image
            src="/677276fd561b48d392692df4_burger-icon.svg"
            alt="Menu"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
          />

        </div>

      </div>
    </header>
  );
}