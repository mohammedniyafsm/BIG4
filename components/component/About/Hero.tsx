

export default function Hero() {
    return (
        <div className="h-screen w-screen flex justify-center items-center text-center">
            <div className="">
                <h1 className="text-3xl lg:text-8xl  font-black">CRAFTING  <br />SPACES</h1>
            </div>

            <div className="absolute bottom-8 lg:bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                <span className="text-[8px] lg:text-[10px]  uppercase  mix-blend-difference text-white">
                    Scroll Down
                </span>
            </div>
        </div>
    )
}