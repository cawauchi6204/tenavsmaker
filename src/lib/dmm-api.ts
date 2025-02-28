/**
 * DMM API v3 を利用するためのユーティリティ関数
 * https://affiliate.dmm.com/api/v3/itemlist.html
 */

// DMM API のレスポンス型定義
export interface DmmApiResponse {
  result: {
    status: number;
    result_count: number;
    total_count: number;
    first_position: number;
    items: DmmItem[];
  };
}

// DMM API の商品情報型定義
export interface DmmItem {
  service_code: string;
  service_name: string;
  floor_code: string;
  floor_name: string;
  category_name: string;
  content_id: string;
  product_id: string;
  title: string;
  volume: string;
  review: {
    count: number;
    average: number;
  };
  URL: string;
  URLsp: string;
  affiliateURL: string;
  affiliateURLsp: string;
  image_url: {
    list: string;
    small: string;
    large: string;
  };
  date: string;
  iteminfo: {
    genre: {
      id: string;
      name: string;
    }[];
    maker: {
      id: string;
      name: string;
    }[];
    actress: {
      id: string;
      name: string;
    }[];
    director: {
      id: string;
      name: string;
    }[];
    series: {
      id: string;
      name: string;
    }[];
  };
  price: string;
}

// DMM API の検索パラメータ型定義
export interface DmmApiParams {
  site: string;
  service: string;
  floor?: string;
  hits?: number;
  offset?: number;
  sort?: string;
  keyword?: string;
  cid?: string;
  article?: string;
  article_id?: string;
  gte_date?: string;
  lte_date?: string;
  mono_stock?: string;
  output?: string;
  callback?: string;
  actress?: string;
  director?: string;
  maker?: string;
  label?: string;
  series?: string;
  genre?: string;
}

// アフィリエイトID
const AFFILIATE_ID = process.env.DMM_AFFILIATE_ID || "";
// API ID (環境変数から取得する場合)
const API_ID = process.env.DMM_API_ID || "";

/**
 * DMM API を呼び出す関数
 * @param params 検索パラメータ
 * @returns API レスポンス
 */
export async function fetchDmmApi(
  params: DmmApiParams
): Promise<DmmApiResponse> {
  // API のベース URL
  const baseUrl = "https://api.dmm.com/affiliate/v3/ItemList";

  // API ID が設定されているか確認
  if (!API_ID) {
    console.warn("DMM_API_ID is not set. Using dummy data instead.");
    // API ID が設定されていない場合はダミーデータを返す
    return {
      result: {
        status: 200,
        result_count: 1,
        total_count: 1,
        first_position: 1,
        items: [
          {
            service_code: "digital",
            service_name: "FANZA",
            floor_code: "videoa",
            floor_name: "ビデオ",
            category_name: "ビデオ",
            content_id: "dummy_001",
            product_id: "dummy_001",
            title: "サンプル動画タイトル",
            volume: "",
            review: {
              count: 10,
              average: 4.5,
            },
            URL: "https://www.dmm.co.jp/digital/videoa/",
            URLsp: "https://www.dmm.co.jp/digital/videoa/",
            affiliateURL: "https://www.dmm.co.jp/digital/videoa/",
            affiliateURLsp: "https://www.dmm.co.jp/digital/videoa/",
            image_url: {
              list: "https://pics.dmm.co.jp/digital/video/dummy_001/dummy_001ps.jpg",
              small:
                "https://pics.dmm.co.jp/digital/video/dummy_001/dummy_001ps.jpg",
              large:
                "https://pics.dmm.co.jp/digital/video/dummy_001/dummy_001pl.jpg",
            },
            date: "2025-02-28",
            iteminfo: {
              genre: [
                {
                  id: "1",
                  name: "サンプルジャンル",
                },
              ],
              maker: [
                {
                  id: "1",
                  name: "サンプルメーカー",
                },
              ],
              actress: [
                {
                  id: "1",
                  name: "サンプル女優",
                },
              ],
              director: [
                {
                  id: "1",
                  name: "サンプル監督",
                },
              ],
              series: [
                {
                  id: "1",
                  name: "サンプルシリーズ",
                },
              ],
            },
            price: "¥500〜",
          },
        ],
      },
    };
  }

  // パラメータを URL クエリに変換（すべての値を文字列に変換）
  const queryParams = new URLSearchParams();

  // 必須パラメータを追加
  queryParams.append("api_id", API_ID);
  queryParams.append("affiliate_id", AFFILIATE_ID);

  // 検索パラメータを追加（値を文字列に変換）
  // キーワードや女優名などはすでにエンコード済みなので、そのまま追加する
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  try {
    // API リクエスト
    const response = await fetch(`${baseUrl}?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(
        `DMM API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // レスポンスの形式を確認
    if (!data || !data.result || !Array.isArray(data.result.items)) {
      throw new Error("Invalid API response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching DMM API:", error);
    // エラーが発生した場合もダミーデータを返す
    return {
      result: {
        status: 200,
        result_count: 1,
        total_count: 1,
        first_position: 1,
        items: [
          {
            service_code: "digital",
            service_name: "FANZA",
            floor_code: "videoa",
            floor_name: "ビデオ",
            category_name: "ビデオ",
            content_id: "error_001",
            product_id: "error_001",
            title: "API エラー（ダミーデータ）",
            volume: "",
            review: {
              count: 0,
              average: 0,
            },
            URL: "https://www.dmm.co.jp/digital/videoa/",
            URLsp: "https://www.dmm.co.jp/digital/videoa/",
            affiliateURL: "https://www.dmm.co.jp/digital/videoa/",
            affiliateURLsp: "https://www.dmm.co.jp/digital/videoa/",
            image_url: {
              list: "https://pics.dmm.co.jp/digital/video/error_001/error_001ps.jpg",
              small: "https://pics.dmm.co.jp/digital/video/error_001/error_001ps.jpg",
              large: "https://pics.dmm.co.jp/digital/video/error_001/error_001pl.jpg",
            },
            date: "2025-02-28",
            iteminfo: {
              genre: [
                {
                  id: "1",
                  name: "エラー",
                },
              ],
              maker: [
                {
                  id: "1",
                  name: "エラー",
                },
              ],
              actress: [
                {
                  id: "1",
                  name: "エラー",
                },
              ],
              director: [
                {
                  id: "1",
                  name: "エラー",
                },
              ],
              series: [
                {
                  id: "1",
                  name: "エラー",
                },
              ],
            },
            price: "¥0",
          },
        ],
      },
    };
  }
}

/**
 * タイトルで商品を検索する
 * @param keyword 検索キーワード
 * @param hits 取得件数 (デフォルト: 10)
 * @returns 検索結果
 */
export async function searchByTitle(
  keyword: string,
  hits: number = 10
): Promise<DmmItem[]> {
  try {
    console.log(`タイトルで検索: "${keyword}", 取得件数: ${hits}`);
    // キーワードをエンコード
    const encodedKeyword = encodeURIComponent(keyword);
    const response = await fetchDmmApi({
      site: "FANZA",
      service: "digital",
      floor: "videoa",
      hits: hits,
      sort: "rank",
      keyword: encodedKeyword,
      output: "json",
    });

    if (!response.result || !Array.isArray(response.result.items)) {
      console.error("無効なレスポンス形式:", response);
      return [];
    }

    return response.result.items;
  } catch (error) {
    console.error("タイトルでの検索に失敗:", error);
    return []; // エラー時は空配列を返す
  }
}

/**
 * 女優名で商品を検索する
 * @param actressName 女優名
 * @param hits 取得件数 (デフォルト: 10)
 * @returns 検索結果
 */
export async function searchByActress(
  actressName: string,
  hits: number = 10
): Promise<DmmItem[]> {
  try {
    console.log(`女優名で検索: "${actressName}", 取得件数: ${hits}`);
    // 女優名をエンコード
    const encodedActressName = encodeURIComponent(actressName);
    const response = await fetchDmmApi({
      site: "FANZA",
      service: "digital",
      floor: "videoa",
      hits: hits,
      sort: "rank",
      actress: encodedActressName,
      output: "json",
    });

    if (!response.result || !Array.isArray(response.result.items)) {
      console.error("無効なレスポンス形式:", response);
      return [];
    }

    return response.result.items;
  } catch (error) {
    console.error("女優名での検索に失敗:", error);
    return []; // エラー時は空配列を返す
  }
}

/**
 * 一般的なキーワードで商品を検索する
 * @param keyword 検索キーワード
 * @param hits 取得件数 (デフォルト: 10)
 * @param options 追加の検索オプション
 * @returns 検索結果
 */
export async function searchByKeyword(
  keyword: string,
  hits: number = 10,
  options: {
    floor?: string;
    sort?: string;
    genre?: string;
    maker?: string;
    series?: string;
    director?: string;
  } = {}
): Promise<DmmItem[]> {
  try {
    console.log(`キーワードで検索: "${keyword}", 取得件数: ${hits}, オプション:`, options);
    // キーワードをエンコード
    const encodedKeyword = encodeURIComponent(keyword);
    
    // 基本パラメータ
    const params: DmmApiParams = {
      site: "FANZA",
      service: "digital",
      floor: "videoa",
      hits: hits,
      sort: options.sort || "date",
      keyword: encodedKeyword,
      output: "json",
    };
    
    // 追加オプションがあれば追加
    if (options.floor) params.floor = options.floor;
    if (options.genre) params.genre = encodeURIComponent(options.genre);
    if (options.maker) params.maker = encodeURIComponent(options.maker);
    if (options.series) params.series = encodeURIComponent(options.series);
    if (options.director) params.director = encodeURIComponent(options.director);
    
    const response = await fetchDmmApi(params);

    if (!response.result || !Array.isArray(response.result.items)) {
      console.error("無効なレスポンス形式:", response);
      return [];
    }

    return response.result.items;
  } catch (error) {
    console.error("キーワード検索に失敗:", error);
    return []; // エラー時は空配列を返す
  }
}

/**
 * 商品情報を VideoData 形式に変換する
 * @param item DMM API の商品情報
 * @returns VideoData 形式の商品情報
 */
export function convertToVideoData(item: DmmItem) {
  // 安全にプロパティにアクセスするためのヘルパー関数
  const safeAccess = <T, K extends keyof T>(
    obj: T | null | undefined,
    key: K
  ): T[K] | undefined => {
    return obj ? obj[key] : undefined;
  };

  // 安全に配列をマップするためのヘルパー関数
  const safeMap = <T, U>(
    arr: T[] | null | undefined,
    fn: (item: T) => U
  ): U[] => {
    return arr && Array.isArray(arr) ? arr.map(fn) : [];
  };

  return {
    id: item.content_id || "",
    title: item.title || "",
    actress: safeMap(
      safeAccess(item.iteminfo, "actress"),
      (a) => a.name || ""
    ).join(", "),
    quality: (item.service_name || "").includes("4K") ? "4K" : "HD",
    releaseDate: item.date || "",
    duration: 0, // DMM API からは取得できない情報
    review: safeAccess(item.review, "average") || 0,
    genres: safeMap(safeAccess(item.iteminfo, "genre"), (g) => g.name || ""),
    description: "", // DMM API からは取得できない情報
    maker: safeMap(
      safeAccess(item.iteminfo, "maker"),
      (m) => m.name || ""
    ).join(", "),
    label: "", // DMM API からは取得できない情報
    director: safeMap(
      safeAccess(item.iteminfo, "director"),
      (d) => d.name || ""
    ).join(", "),
    price: item.price || "",
    imageUrls: [
      safeAccess(item.image_url, "large"),
      safeAccess(item.image_url, "small"),
      safeAccess(item.image_url, "list"),
    ].filter(Boolean) as string[],
  };
}
