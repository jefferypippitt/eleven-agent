import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto text-center text-muted-foreground py-5 px-7 border-t">
      <p className="text-sm">
        Built with{" "}
        <Link
          href="https://github.com/elevenlabs/ui"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          ElevenLabs UI
        </Link>
      </p>
    </footer>
  );
}
