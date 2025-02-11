"use client";

import { useEffect, useState } from "react";

export default function AgeCheckModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isAdult = localStorage.getItem("isAdult");
    if (!isAdult) {
      setShowModal(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("isAdult", "true");
    setShowModal(false);
  };

  const handleDeny = () => {
    window.history.back();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div className="bg-black border border-[#ffa31a] rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">このサイトはアダルトサイトです。</h2>
        </div>
        <p className="text-white mb-8">
          このウェブサイトには、ヌードや露骨な性行為描写を含む、年齢制限のあるコンテンツが含まれています。
          クリックすることにより、あなたは18歳以上、またはあなたがウェブサイトにアクセスしている司法管轄区の成人年齢であることを確認し、
          性的に露骨なコンテンツを閲覧することに同意するものとします。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleConfirm}
            className="px-8 py-3 bg-[#ffa31a] text-white rounded font-medium hover:bg-[#ff9900] transition-colors text-lg"
          >
            私は18歳以上です - 入力
          </button>
          <button
            onClick={handleDeny}
            className="px-8 py-3 bg-gray-700 text-white rounded font-medium hover:bg-gray-600 transition-colors text-lg"
          >
            私は18歳未満です - 退出
          </button>
        </div>
      </div>
    </div>
  );
}