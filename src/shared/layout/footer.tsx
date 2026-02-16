export function Footer() {
  return (
    <footer className="border-t border-border-default">
      <div className="max-w-[1280px] mx-auto h-20 flex items-center justify-between px-4 md:px-8">
        <span className="text-[12px] leading-[16px] text-text-muted">
          &copy; 2025 Cryptree
        </span>
        <div className="flex items-center gap-4">
          {["Twitter", "Discord", "Docs"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[12px] leading-[16px] text-text-muted hover:text-text-secondary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
