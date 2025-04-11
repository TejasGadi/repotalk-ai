export default function RefundPolicyPage({emailToReachOut}: any) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Cancellations & Refunds</h1>
        <p>RepoTalk AI offers digital services. Once a subscription is purchased, it is considered final.</p>
        <p className="mt-4">
          Refunds will only be issued in cases of duplicate payments or technical failures caused by us. Any such request must be raised within 7 days of the transaction.
        </p>
        <p className="mt-4">
          To request a refund, contact us at <strong>{emailToReachOut}</strong> with your transaction details.
        </p>
      </main>
    );
  }
  