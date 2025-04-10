import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container px-4 md:px-6 py-12">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RepoTalk AI. All rights reserved.
          </p>
      </div>
    </footer>
  )
}