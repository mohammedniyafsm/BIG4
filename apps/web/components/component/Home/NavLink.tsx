"use client";

interface NavLinkProps {
  title: string;
  href: string;
}

export default function NavLink({ title, href }: NavLinkProps) {
  return (
    <a
      href={href}
      className="group relative block h-[10px] overflow-hidden uppercase"
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
        <span className="h-[10px] text-[8px] font-semibold tracking-[0.12em] leading-[10px]">
          {title}
        </span>

        <span className="h-[10px] text-[8px] font-semibold tracking-[0.12em] leading-[10px]">
          {title}
        </span>
      </div>
    </a>
  );
}