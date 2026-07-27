"use client";

interface NavLinkProps {
  title: string;
  href: string;
}

export default function NavLink({ title, href }: NavLinkProps) {
  return (
    <a
      href={href}
      className="group relative block h-[18px] overflow-hidden uppercase"
    >
      <div
        className="
          flex flex-col
          transition-transform
          duration-500
          ease-[cubic-bezier(.76,0,.24,1)]
          group-hover:-translate-y-1/2
        "
      >
        <span className="h-[18px] text-[12px] md:text-[13px] font-semibold tracking-[0.15em] leading-[18px]">
          {title}
        </span>

        <span className="h-[18px] text-[12px] md:text-[13px] font-semibold tracking-[0.15em] leading-[18px]">
          {title}
        </span>
      </div>
    </a>
  );
}