"use client";
import { FiDollarSign } from "react-icons/fi";
import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import WaterLoader from "@/components/loaders/WaterLoader";

export default function StudentFeeLoop() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetch("/api/student/fees")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <WaterLoader label="Loading Your Fees..." />;
  if (data?.error) return <p className="text-center text-red-500">{data.error}</p>;

  const { student, fees } = data;

  const handlePayClick = (fee: any) => {
    setSelectedFee(fee);
    setModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedFee) return;

    setProcessingPayment(true);

    try {
      // Replace this with your real payment API
      const res = await fetch(`/api/student/pay/${selectedFee.fee.id}`, {
        method: "POST",
      });
      const result = await res.json();

      alert(`Payment Status: ${result.status}`);
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    } finally {
      setProcessingPayment(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Fees Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fees.map((item: any, idx: number) => {
          const percentPaid = Math.min(
            (item.totalPaid / item.fee.totalAmount) * 100,
            100
          );

          return (
            <div
              key={item.fee.id}
              className={`bg-white shadow hover:shadow-lg transition rounded-lg p-6 flex flex-col justify-between opacity-0 animate-fade-in`}
              style={{ animationDelay: `${idx * 150}ms`, animationFillMode: "forwards" }}
            >
              <div>
                <p className="text-lg font-bold text-gray-900">{item.fee.name}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Total: <span className="font-medium">{item.fee.totalAmount.toLocaleString()} XAF</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Paid: <span className="font-medium">{item.totalPaid.toLocaleString()} XAF</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Balance: <span className="font-medium">{item.balance.toLocaleString()} XAF</span>
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
                        percentPaid === 100
                          ? "bg-green-500"
                          : percentPaid >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentPaid}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentPaid.toFixed(0)}% Paid</p>
                </div>
              </div>

              {/* Status + Action */}
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : item.status === "PARTIALLY PAID"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>
                <div className="flex gap-2">
                  <Link href={`/student/fees/${item.fee.id}`}>
                    <button className="px-4 py-2 bg-primary cursor-pointer hover:bg-blue-700 text-white text-sm rounded-md transition">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Headless UI Modal */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-50"
            leave="ease-in duration-200"
            leaveFrom="opacity-50"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <Dialog.Title className="text-lg font-semibold mb-4">
                  Confirm Payment
                </Dialog.Title>
                <Dialog.Description className="text-gray-700 mb-6">
                  Are you sure you want to pay <strong>{selectedFee?.fee.name}</strong>? <br />
                  Amount: <strong>{selectedFee?.balance.toLocaleString()} XAF</strong>
                </Dialog.Description>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
                    onClick={confirmPayment}
                    disabled={processingPayment}
                  >
                    {processingPayment ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
