export default function ContactUsPage({emailToReachOut, contactNum, address}: any) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
        <p>If you have any questions or concerns, please reach out to us:</p>
        <ul className="list-disc pl-6 mt-4">
          <li>Email: {emailToReachOut}</li>
          <li>Phone: {contactNum}</li>
          <li>Address: {address}</li>
        </ul>
      </main>
    );
  }
  