"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

interface AV {
  id: number;
  title: string;
  image: string;
  comment?: string;
  packageId?: string; // データベースのpackage_idを保持するためのプロパティ
}

interface SearchResult {
  id: string;
  title: string;
  image_url: string;
  fanza_url: string;
  actress?: string;
  maker?: string;
  date?: string;
  price?: string;
  genres?: string[];
  series?: string;
  director?: string;
}

export default function AVSelector() {
  const [selectedAVs, setSelectedAVs] = useState<AV[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentTargetAV, setCommentTargetAV] = useState<AV | null>(null);
  const [commentText, setCommentText] = useState("");
  const [shareTitle, setShareTitle] = useState("名刺代わりのAV10選");
  // チェックされた検索結果を追跡するステート
  const [checkedResults, setCheckedResults] = useState<string[]>([]);

  // 10個のスライドを作成
  const slides: AV[] = Array(10)
    .fill(null)
    .map((_, index) => {
      // インデックスに対応する選択済みAVがあればそれを使用
      if (index < selectedAVs.length) {
        return selectedAVs[index];
      }

      // それ以外は空のスロットを返す
      return {
        id: index + 1,
        title: "空きスロット",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-tenbooksmaker-2025-02-11-14_16_15-OwirlbOWRgLYmBj8CncP9ydlGt4Sck.png",
      };
    });

  // 空きスロットに自動的にAVをセットするため、個別選択関数は不要

  const handleSearch = async () => {
    try {
      // 検索パラメータを作成
      const params: Record<string, string> = {
        term: searchTerm,
        type: searchType,
      };

      // キーワード検索の場合、追加のオプションを設定できるようにする
      // 現在はシンプルな実装だが、将来的にはUIで選択できるようにすることも可能
      if (searchType === "keyword") {
        // 例: 並び順を日付順に
        params.sort = "date";
        // 例: 取得件数を増やす
        params.hits = "20";
      }

      const response = await fetch(
        "/api/search?" + new URLSearchParams(params)
      );
      const data = await response.json();

      // データが配列かどうかを確認
      if (Array.isArray(data)) {
        console.log("検索結果:", data); // 検索結果をコンソールに出力
        setSearchResults(data);
      } else if (data.error) {
        // エラーメッセージがある場合
        console.error("Search error:", data.error);
        alert(`検索エラー: ${data.error}`);
        setSearchResults([]);
      } else {
        // 予期しない形式の場合は空配列を設定
        console.error("Unexpected response format:", data);
        setSearchResults([]);
      }

      setShowSearchModal(true);
    } catch (error) {
      console.error("Search failed:", error);
      alert("検索に失敗しました。もう一度お試しください。");
      setSearchResults([]);
    }
  };

  const handleShare = async () => {
    try {
      // データベースに保存
      const response = await fetch("/api/selections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: shareTitle,
          selectedAVs: selectedAVs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("保存エラー:", data.error);
        alert(`保存に失敗しました: ${data.error}`);
        return;
      }

      console.log("保存成功:", data);

      // 保存成功後にTwitterシェア
      const baseText = `#${shareTitle}`;
      const selectionUrl = `${window.location.origin}/selections/${data.selection.id}`;
      const shareText = encodeURIComponent(
        `${baseText}\n${selectionUrl}\n\n#名刺代わりのAV10選メーカー`
      );
      window.open(
        `https://twitter.com/intent/tweet?text=${shareText}`,
        "_blank"
      );
    } catch (error) {
      console.error("シェアエラー:", error);
      alert("シェア処理中にエラーが発生しました。もう一度お試しください。");
    }
  };

  const handleReset = () => {
    setSelectedAVs([]);
    setCurrentSlide(0);
    setSearchTerm("");
    setShareTitle("名刺代わりのAV10選");
  };

  // 1ページあたりの表示数を定義
  const AVS_PER_PAGE = 3;

  // 表示する本の配列を計算
  const visibleSlides = slides.slice(
    currentSlide * AVS_PER_PAGE,
    currentSlide * AVS_PER_PAGE + AVS_PER_PAGE
  );

  // 最大ページ数を計算
  const maxPage = Math.ceil(slides.length / AVS_PER_PAGE) - 1;

  // コメント追加用の関数
  const handleCommentClick = (e: React.MouseEvent, av: AV) => {
    e.stopPropagation(); // カード選択のイベントバブリングを防ぐ
    setCommentTargetAV(av);
    setCommentText(av.comment || "");
    setShowCommentModal(true);
  };

  // コメント保存用の関数
  const handleCommentSave = () => {
    if (commentTargetAV) {
      setSelectedAVs((prev) =>
        prev.map((av) =>
          av.id === commentTargetAV.id ? { ...av, comment: commentText } : av
        )
      );
    }
    setShowCommentModal(false);
    setCommentTargetAV(null);
    setCommentText("");
  };

  // チェックボックスの状態を変更するハンドラー
  const handleCheckResult = (id: string, checked: boolean) => {
    setCheckedResults((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((resultId) => resultId !== id);
      }
    });
  };

  // チェックされた検索結果を10選に追加する関数
  const handleAddCheckedToSelection = async () => {
    try {
      // チェックされた検索結果を取得
      const checkedItems = searchResults.filter((result) =>
        checkedResults.includes(result.id)
      );

      // 現在の選択数を確認
      if (selectedAVs.length + checkedItems.length > 10) {
        alert(
          `現在${selectedAVs.length}個選択されています。あと${
            10 - selectedAVs.length
          }個まで追加できます。`
        );
        return;
      }

      // 選択されたAVに追加
      const newSelectedAVs = [...selectedAVs];

      // 各アイテムをデータベースに保存し、ローカルステートに追加
      for (const item of checkedItems) {
        // 既に選択されているIDがないか確認
        const existingIndex = newSelectedAVs.findIndex(
          (av) => av.title === item.title && av.image === item.image_url
        );

        if (existingIndex === -1) {
          // パッケージをデータベースに保存
          await fetch("/api/packages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: item.id,
              title: item.title,
              image_url: item.image_url,
              fanza_url: item.fanza_url,
              description: item.title, // 詳細な説明がない場合はタイトルを使用
            }),
          });

          // 新しいIDを割り当て（現在の最大ID + 1）
          const maxId =
            newSelectedAVs.length > 0
              ? Math.max(...newSelectedAVs.map((av) => av.id))
              : 0;

          const newAV: AV = {
            id: maxId + 1,
            title: item.title,
            image: item.image_url,
            packageId: item.id, // データベースのpackage_idを保持
          };

          newSelectedAVs.push(newAV);
        }
      }

      setSelectedAVs(newSelectedAVs);

      // チェックをクリア
      setCheckedResults([]);
      // モーダルを閉じる
      setShowSearchModal(false);
    } catch (error) {
      console.error("選択アイテム追加エラー:", error);
      alert(
        "選択アイテムの追加中にエラーが発生しました。もう一度お試しください。"
      );
    }
  };

  // 選択済みAVを削除する関数
  const handleRemoveAV = (e: React.MouseEvent, avId: number) => {
    e.stopPropagation(); // カード全体のクリックイベントを防止
    setSelectedAVs((prev) => prev.filter((av) => av.id !== avId));
  };

  // handleAVSelect関数は不要になったため削除

  return (
    <div>
      <div className="max-w-[800px] mx-auto px-4 pb-8">
        <div className="flex items-center justify-center gap-2 mb-4"></div>

        <div className="flex items-start justify-center flex-col gap-2 mb-8">
          <div className="flex items-center gap-2">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[120px] bg-white border-[#ccc] text-[#666] hover:bg-gray-50">
                <SelectValue placeholder="タイトル" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">タイトル</SelectItem>
                <SelectItem value="actress">女優名</SelectItem>
                <SelectItem value="keyword">キーワード</SelectItem>
              </SelectContent>
            </Select>
            <span>で探す</span>
          </div>
          <div className="w-full flex items-center gap-2">
            <div className="relative flex-1 max-w-[400px]">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  searchType === "title"
                    ? "タイトルで探す"
                    : searchType === "actress"
                    ? "女優名で探す"
                    : "キーワードで探す"
                }
                className="pl-8 bg-white border-[#ccc] text-[#666] hover:bg-gray-50 text-base"
                style={{ fontSize: "16px" }}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999]" />
            </div>
            <button
              className="px-4 py-2 bg-[#ffa31a] text-white rounded hover:bg-[#5c7eaf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={!searchTerm.trim()}
            >
              検索
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="relative w-full">
            <div className="flex overflow-hidden w-full px-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className="flex gap-2 w-full"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{
                    type: "keyframes",
                    stiffness: 3000,
                    damping: 200,
                    mass: 0.8,
                    duration: 0.1,
                  }}
                >
                  {visibleSlides.map((slide) => (
                    <div
                      key={slide.id}
                      className="w-[calc((100%-1rem)/3)] flex-shrink-0"
                    >
                      <Card
                        className={`p-2 md:p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full ${
                          selectedAVs.find((b) => b.id === slide.id)
                            ? "border-8 border-[#ffa31a]"
                            : ""
                        }`}
                      >
                        <div className="w-full aspect-[3/4] bg-gray-50 rounded flex items-center justify-center mb-2 md:mb-4 overflow-hidden relative">
                          {slide.title !== "空きスロット" ? (
                            <>
                              <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                              />
                              {/* バツボタンを追加 - 位置とz-indexを調整 */}
                              <div className="absolute top-1 right-1 z-50">
                                <button
                                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                                  onClick={(e) => handleRemoveAV(e, slide.id)}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-1">
                                <p className="text-white text-xs truncate">
                                  {slide.title}
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-center text-xs md:text-sm px-2 md:px-4">
                              空きスロット
                            </p>
                          )}
                        </div>
                        <button
                          className="w-full py-1 md:py-2 px-2 bg-[#808080] md:px-4 text-white rounded transition-colors text-xs md:text-sm"
                          onClick={(e) => handleCommentClick(e, slide)}
                        >
                          {slide.comment ? "コメントを編集" : "+ コメント"}
                        </button>
                      </Card>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#ffa31a] rounded-full p-1"
              onClick={() =>
                setCurrentSlide((prev) => (prev === 0 ? maxPage : prev - 1))
              }
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#ffa31a] rounded-full p-1"
              onClick={() =>
                setCurrentSlide((prev) => (prev === maxPage ? 0 : prev + 1))
              }
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: maxPage + 1 }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#6c8ebf]" : "bg-[#ccc]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center gap-2">
            <p className="text-sm">共有時のタイトル</p>
            <div className="bg-white my-4 text-black relative flex-1 max-w-[400px]">
              <Input
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                placeholder="タイトルを入力してください"
              />
            </div>
          </div>
          <button
            className="w-full py-3 bg-[#1da1f2] text-white rounded font-medium hover:bg-[#1a91da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedAVs.length !== 10}
            onClick={handleShare}
          >
            twitterでシェア
          </button>
        </div>

        <button
          className="w-full py-3 bg-[#e91e63] text-white rounded font-medium hover:bg-[#d81557] transition-colors"
          onClick={handleReset}
        >
          リセット
        </button>
        {/* これまでの名刺代わりのAV10選 */}
        {/* <footer className="mt-8 text-center text-sm text-[#666] border-t border-[#eee] pt-8">
          <a href="#" className="hover:text-[#333] transition-colors">
            プライバシーポリシー
          </a>
          <span className="mx-2">|</span>
          <a href="#" className="hover:text-[#333] transition-colors">
            利用規約
          </a>
        </footer> */}

        {/* 検索モーダル */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">検索結果</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSearchModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border-8 rounded-lg p-4 cursor-pointer hover:border-[#ffa31a] relative"
                    onClick={() =>
                      handleCheckResult(
                        result.id,
                        !checkedResults.includes(result.id)
                      )
                    }
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <input
                        type="checkbox"
                        className="h-5 w-5 cursor-pointer"
                        checked={checkedResults.includes(result.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckResult(result.id, e.target.checked);
                        }}
                      />
                    </div>
                    <div className="cursor-pointer">
                      <img
                        src={result.image_url}
                        alt={result.title}
                        className="w-full aspect-[3/4] object-cover rounded mb-2"
                      />
                      <p className="text-sm font-bold mb-1 text-black">
                        <span className="font-semibold">タイトル:</span>{" "}
                        {result.title}
                      </p>
                      {result.actress && (
                        <p className="text-xs text-gray-700 mb-1">
                          <span className="font-semibold">女優:</span>{" "}
                          {result.actress}
                        </p>
                      )}
                      {result.maker && (
                        <p className="text-xs text-gray-700 mb-1">
                          <span className="font-semibold">メーカー:</span>{" "}
                          {result.maker}
                        </p>
                      )}
                      {result.series && (
                        <p className="text-xs text-gray-700 mb-1">
                          <span className="font-semibold">シリーズ:</span>{" "}
                          {result.series}
                        </p>
                      )}
                      {result.director && (
                        <p className="text-xs text-gray-700 mb-1">
                          <span className="font-semibold">監督:</span>{" "}
                          {result.director}
                        </p>
                      )}
                      {result.genres && result.genres.length > 0 && (
                        <p className="text-xs text-gray-700 mb-1">
                          <span className="font-semibold">ジャンル:</span>
                          <span className="flex flex-wrap gap-1 mt-1">
                            {result.genres.slice(0, 3).map((genre, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 px-1 rounded text-[10px]"
                              >
                                {genre}
                              </span>
                            ))}
                            {result.genres.length > 3 && (
                              <span className="text-[10px] text-gray-500">
                                +{result.genres.length - 3}
                              </span>
                            )}
                          </span>
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        {result.date && (
                          <p className="text-xs text-gray-600">{result.date}</p>
                        )}
                        {result.price && (
                          <p className="text-xs font-bold text-[#ffa31a]">
                            {result.price}
                          </p>
                        )}
                      </div>
                      <a
                        href={result.fanza_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center mt-2 text-xs bg-[#ffa31a] text-white py-1 px-2 rounded hover:bg-[#ff9900]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        FANZAで見る
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* セットボタン - モーダルの下部に固定表示 */}
              <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-center z-[1000]">
                <button
                  onClick={handleAddCheckedToSelection}
                  disabled={checkedResults.length === 0}
                  className="px-8 py-3 bg-[#ffa31a] text-white rounded-lg font-bold hover:bg-[#ff9900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkedResults.length > 0
                    ? `選択した${checkedResults.length}作品をセット`
                    : "作品を選択してください"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* コメント入力モーダル */}
        {showCommentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">コメントを入力</h2>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6 bg-white" />
                </button>
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full text-black h-32 p-2 border border-gray-300 rounded mb-4 resize-none"
                placeholder="コメントを入力してください"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCommentSave}
                  className="px-4 py-2 bg-[#ffa31a] text-white rounded hover:bg-[#ff9900]"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
