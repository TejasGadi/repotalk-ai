export default function ShippingPolicyPage({emailToReachOut}: any) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Shipping Policy</h1>
        <p>RepoTalk AI is a digital platform and does not involve the shipping of any physical goods.</p>
        <p className="mt-4">
          Upon successful payment, services and features are activated either instantly or after a short verification process. If you encounter any delays, please contact us at {emailToReachOut}.
        </p>
      </main>
    );
  }
  