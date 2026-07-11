import Image from "next/image";

const sections = [
  {
    title: "INSPIRE",
    src: "/44.webp",
    copy: "Discover collections that combine timeless design, exceptional craftsmanship, and lasting quality. From elegant tiles to modern sanitaryware and bath fittings, every product is selected to elevate your living spaces.",
  },
  {
    title: "SELECT",
    src: "/45.webp",
    copy: "Our experts help you choose products that complement your style, budget, and project requirements. With personalized guidance and trusted recommendations, we make creating beautiful spaces effortless.",
  },
  {
    title: "COMPLETE",
    src: "/46.jpg",
    copy: "Every project deserves dependable service. From consultation and product selection to timely delivery and after-sales support, BIG4 is committed to making your journey smooth from start to finish.",
  },
];

export default function Exper() {
  return (
    <>
      <div>
        {/* mobile hero */}
        <div className="flex flex-col justify-center items-center text-center gap-4 py-20 md:hidden">
          <h1 className="text-3xl font-black uppercase">
            8+ <br /> years
          </h1>
          <p className="text-xs px-4 uppercase font-black">
            Transforming Homes with Premium Surfaces & Bath Solutions.
          </p>
        </div>

        {/* desktop hero */}
        <div className="hidden md:flex flex-col justify-center items-center text-center gap-4 py-20">
          <h1 className="font-black uppercase text-6xl lg:text-8xl xl:text-9xl">
            8+ <br /> years
          </h1>
          <p className="uppercase font-black mt-8 px-4 text-base lg:text-lg">
            Transforming Homes with Premium Surfaces <br /> & Bath Solutions.
          </p>
        </div>

        {/* sections */}
        <div className="py-16 flex flex-col gap-16 md:gap-28 md:px-6 lg:px-16">
          {sections.map((section, index) => {
            const imageLeft = index % 2 === 0;

            return (
              <div
                key={section.title}
                className={`px-6 md:px-0 flex flex-col md:items-center md:gap-20 lg:gap-28 xl:gap-40 ${
                  imageLeft ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="md:w-1/2">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">
                    {section.title}
                  </h1>
                  <p className="font-inter text-xs mt-4 md:mt-6 lg:mt-8 leading-5 text-[#8e8e8e] md:w-[70%]">
                    {section.copy}
                  </p>
                </div>

                <div className="relative mt-6 md:mt-0 md:w-1/2 h-[250px] md:h-[440px] lg:h-[540px] xl:h-[600px] w-full overflow-hidden">
                  <Image
                    src={section.src}
                    alt={section.title}
                    fill
                    priority
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}