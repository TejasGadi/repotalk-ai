export default function PrivacyPolicyPage({emailToReachOut}: any) {
    return (
      <main className="p-6 max-w-3xl m-auto">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p>
          At RepoTalk AI, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>We collect only essential data like email, GitHub username, and payment information.</li>
          <li>Your data is used to personalize your experience and improve our service.</li>
          <li>We do not sell your information to third parties.</li>
          <li>All data is stored securely and handled according to industry best practices.</li>
        </ul>
        <p className="mt-4">
          For any questions, reach out to <strong>{emailToReachOut}</strong>.
        </p>
      </main>
    );
  }
  