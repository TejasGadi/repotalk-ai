import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="flex flex-col border-t text-sm text-muted-foreground text-center p-4">
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        {/* Left: Legal Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Link href="/legal/privacy-policy" className="hover:text-primary transition">
            Privacy Policy
          </Link>
          <Link href="/legal/terms-and-conditions" className="hover:text-primary transition">
            Terms & Conditions
          </Link>
          <Link href="/legal/cancellations-and-refunds" className="hover:text-primary transition">
            Refund Policy
          </Link>
          <Link href="/legal/contact-us" className="hover:text-primary transition">
            Contact Us
          </Link>
        </div>

        {/* Right: Copyright */}
      </div>

      <div className="container px-4 md:px-6 py-12">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RepoTalk AI. All rights reserved.
          </p>
      </div>

    </footer>
  )
}