export function Footer() {
  return (
    <footer className="border-t border-border-default">
      <div className="max-w-[1280px] mx-auto h-20 flex items-center justify-between px-4 md:px-8">
        <span className="text-[12px] leading-[16px] text-text-muted">
          &copy; 2025 Cryptree
        </span>
        <a
          href="#docs"
          className="text-[12px] leading-[16px] text-text-muted hover:text-text-secondary transition-colors"
        >
          Docs
        </a>
      </div>
    </footer>
  );
}
