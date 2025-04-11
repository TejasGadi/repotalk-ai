import Link from "next/link";
import PrivacyPolicy from "./privacy-policy";
import TermsAndConditions from "./terms-and-conditions";
import CancellationsAndRefunds from "./cancellations-and-refund";
import ShippingPolicy from "./shipping-policy";
import ContactUs from "./contact-us";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export default function LegalPage() {
    const emailToReachOut = "tvgadi2003@gmail.com"
    const contactNum = "+91 9175101275"
  return (
    <>
    <Navbar/>
    <main className="max-w-3xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Legal & Policy Documents</h1>
        <p className="text-muted-foreground">
          Below are the legal policies that govern the use of RepoTalk AI. Please read them carefully.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="flex items-center gap-2 mb-6 space-x-4 text-primary bg-gray-400 p-2 rounded-md">
        <a href="#privacy-policy" className="hover:underline">Privacy</a>
        <a href="#terms-and-conditions" className="hover:underline">Terms</a>
        <a href="#cancellations-and-refunds" className="hover:underline">Refunds</a>
        <a href="#shipping-policy" className="hover:underline">Shipping</a>
        <a href="#contact-us" className="hover:underline">Contact</a>
      </div>

      {/* Legal Sections */}
      <section id="privacy-policy">
        <PrivacyPolicy emailToReachOut={emailToReachOut}/>
      </section>

      <section id="terms-and-conditions">
        <TermsAndConditions />
      </section>

      <section id="cancellations-and-refunds">
        <CancellationsAndRefunds emailToReachOut={emailToReachOut}/>
      </section>

      <section id="shipping-policy">
        <ShippingPolicy emailToReachOut={emailToReachOut}/>
      </section>

      <section id="contact-us">
        <ContactUs emailToReachOut={emailToReachOut} contactNum={contactNum}/>
      </section>
    </main>
    <Footer/>
    </>
  );
}