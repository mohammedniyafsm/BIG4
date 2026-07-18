export default function Experinces() {
    return (
        <div className=" md:min-h-screen w-screen flex justify-center items-center">

            {/* Mobile */}
            <div className="block md:hidden w-full text-center px-6">
                <h1 className="text-3xl font-black uppercase ">
                    The <br />
                    experience <br />
                    begins with <br />
                    BIG4
                </h1>

                <p className="font-inter text-xs mt-8 leading-5 text-[#8e8e8e]">
                    Since 2017, BIG4 Tiles & Sanitary has been transforming homes and commercial spaces with premium tiles, sanitaryware, bath fittings, and surface solutions. Trusted by homeowners, architects, builders, and interior designers, we bring together leading brands, expert guidance, and exceptional quality to help create spaces that are beautiful, functional, and built to last.
                </p>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex w-full justify-center">
                <div className="max-w-6xl text-center">
                    <h1 className="text-6xl font-black uppercase ">
                        The <br />
                        experience <br />
                        begins with <br />
                        BIG4
                    </h1>

                    <p className="font-inter text-sm mt-8 px-[25%]  text-[#8e8e8e]">
                        Since 2017, BIG4 Tiles & Sanitary has been transforming homes and commercial spaces with premium tiles, sanitaryware, bath fittings, and surface solutions. Trusted by homeowners, architects, builders, and interior designers, we bring together leading brands, expert guidance, and exceptional quality to help create spaces that are beautiful, functional, and built to last.
                    </p>
                </div>
            </div>

        </div>
    );
}