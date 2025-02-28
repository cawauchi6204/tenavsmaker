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

// DMM API の女優検索レスポンス型定義
export interface DmmActressApiResponse {
  result: {
    status: number;
    result_count: number;
    total_count: number;
    first_position: number;
    actress: DmmActress[];
  };
}

// DMM API の女優情報型定義
export interface DmmActress {
  id: number;
  name: string;
  ruby: string;
  bust: number;
  cup: string;
  waist: number;
  hip: number;
  height: number;
  birthday: string;
  blood_type: string;
  hobby: string;
  prefectures: string;
  imageURL: {
    small: string;
    large: string;
  };
  listURL: {
    digital: string;
    monthly: string;
    ppm: string;
    mono: string;
    rental: string;
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
  URLsp?: string;
  affiliateURL: string;
  affiliateURLsp?: string;
  imageURL: {
    list: string;
    small: string;
    large: string;
  };
  sampleImageURL?: {
    sample_s: {
      image: string[];
    };
    sample_l: {
      image: string[];
    };
  };
  sampleMovieURL?: {
    size_476_306: string;
    size_560_360: string;
    size_644_414: string;
    size_720_480: string;
    pc_flag: number;
    sp_flag: number;
  };
  prices?: {
    price: string;
    deliveries: {
      delivery: {
        type: string;
        price: string;
      }[];
    };
  };
  date: string;
  iteminfo: {
    genre: {
      id: string | number;
      name: string;
    }[];
    maker: {
      id: string | number;
      name: string;
    }[];
    actress: {
      id: string | number;
      name: string;
      ruby?: string;
    }[];
    director: {
      id: string | number;
      name: string;
      ruby?: string;
    }[];
    series: {
      id: string | number;
      name: string;
    }[];
    label?: {
      id: string | number;
      name: string;
    }[];
  };
  price: string;
}

// DMM API の商品検索パラメータ型定義
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

// DMM API の女優検索パラメータ型定義
export interface DmmActressApiParams {
  initial?: string;
  actress_id?: number;
  keyword?: string;
  gte_bust?: number;
  lte_bust?: number;
  gte_waist?: number;
  lte_waist?: number;
  gte_hip?: number;
  lte_hip?: number;
  gte_height?: number;
  lte_height?: number;
  gte_birthday?: string;
  lte_birthday?: string;
  sort?: string;
  hits?: number;
  offset?: number;
  output?: string;
}

// アフィリエイトID
const AFFILIATE_ID = process.env.DMM_AFFILIATE_ID || "";
// API ID (環境変数から取得する場合)
const API_ID = process.env.DMM_API_ID || "";

/**
 * DMM API の商品検索を呼び出す関数
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
    console.error("DMM_API_ID is not set. API requests will fail.");
    throw new Error(
      "DMM_API_ID is not set. Please check your environment variables."
    );
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
    // APIリクエストURLをログに出力
    const requestUrl = `${baseUrl}?${queryParams.toString()}`;
    console.log("DMM 商品検索 API リクエストURL:", requestUrl);
    
    // API リクエスト
    const response = await fetch(requestUrl);

    console.log(
      `DMM 商品検索 API レスポンスステータス: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      throw new Error(
        `DMM API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // レスポンスの概要をログに出力
    console.log(
      `DMM 商品検索 API レスポンス概要: status=${data.result?.status}, result_count=${data.result?.result_count}, total_count=${data.result?.total_count}`
    );

    // レスポンスの形式を確認
    if (!data || !data.result || !Array.isArray(data.result.items)) {
      throw new Error("Invalid API response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching DMM API:", error);
    // エラーをそのまま投げる
    throw new Error(`DMM API request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * DMM API の女優検索を呼び出す関数
 * @param params 女優検索パラメータ
 * @returns API レスポンス
 */
export async function fetchDmmActressApi(
  params: DmmActressApiParams
): Promise<DmmActressApiResponse> {
  // API のベース URL
  const baseUrl = "https://api.dmm.com/affiliate/v3/ActressSearch";

  // API ID が設定されているか確認
  if (!API_ID) {
    console.error("DMM_API_ID is not set. API requests will fail.");
    throw new Error(
      "DMM_API_ID is not set. Please check your environment variables."
    );
  }

  // パラメータを URL クエリに変換（すべての値を文字列に変換）
  const queryParams = new URLSearchParams();

  // 必須パラメータを追加
  queryParams.append("api_id", API_ID);
  queryParams.append("affiliate_id", AFFILIATE_ID);

  // 検索パラメータを追加（値を文字列に変換）
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  try {
    // APIリクエストURLをログに出力
    const requestUrl = `${baseUrl}?${queryParams.toString()}`;
    console.log("DMM 女優検索 API リクエストURL:", requestUrl);
    
    // API リクエスト
    const response = await fetch(requestUrl);

    console.log(
      `DMM 女優検索 API レスポンスステータス: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      throw new Error(
        `DMM ActressSearch API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    // レスポンスの概要をログに出力
    console.log(
      `DMM 女優検索 API レスポンス概要: status=${data.result?.status}, result_count=${data.result?.result_count}, total_count=${data.result?.total_count}`
    );

    // レスポンスの形式を確認
    if (!data || !data.result || !Array.isArray(data.result.actress)) {
      throw new Error("Invalid API response format for ActressSearch");
    }

    return data;
  } catch (error) {
    console.error("Error fetching DMM ActressSearch API:", error);
    // エラーをそのまま投げる
    throw new Error(`DMM ActressSearch API request failed: ${error instanceof Error ? error.message : String(error)}`);
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
  hits: number = 100
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
  hits: number = 100
): Promise<DmmItem[]> {
  try {
    console.log(`女優名で検索: "${actressName}", 取得件数: ${hits}`);
    const encodedActressName = encodeURIComponent(actressName);

    // 方法1: ActressSearchエンドポイントを使用して女優情報を取得する
    console.log("方法1: ActressSearchエンドポイントを使用");
    try {
      const actressResponse = await fetchDmmActressApi({
        keyword: encodedActressName,
        hits: 10,
        output: "json",
      });
      if (
        actressResponse.result &&
        Array.isArray(actressResponse.result.actress) &&
        actressResponse.result.actress.length > 0
      ) {
        const firstActress = actressResponse.result.actress[0];
        console.log(`女優情報: id=${firstActress.id}, name=${firstActress.name}`);
        // 商品検索に女優IDを使用
        const itemResponse = await fetchDmmApi({
          site: "FANZA",
          service: "digital",
          floor: "videoa",
          hits: hits,
          sort: "rank",
          actress: String(firstActress.id),
          output: "json",
        });
        if (
          itemResponse.result &&
          Array.isArray(itemResponse.result.items) &&
          itemResponse.result.items.length > 0
        ) {
          const sampleItems = itemResponse.result.items.slice(0, 2);
          console.log(
            `女優ID検索の結果サンプル (${sampleItems.length}件):`,
            sampleItems.map((item) => ({
              id: item.content_id,
              title: item.title,
              actress: item.iteminfo?.actress?.map((a) => a.name).join(", "),
            }))
          );
          return itemResponse.result.items;
        }
      }
      console.log("ActressSearchエンドポイントで結果が得られなかった");
    } catch (actressError) {
      console.error("女優検索APIでエラーが発生:", actressError);
    }

    // 方法2: 従来の方法でItemListエンドポイントを使用する
    console.log("方法2: 従来の方法でItemListエンドポイントを使用");
    const params = {
      site: "FANZA",
      service: "digital",
      floor: "videoa",
      hits: hits,
      sort: "rank",
      keyword: encodedActressName,
      output: "json",
    };
    console.log("方法2: keywordパラメータを使用:", JSON.stringify(params));
    const response = await fetchDmmApi(params);
    if (response.result && Array.isArray(response.result.items)) {
      const sampleItems = response.result.items.slice(0, 2);
      console.log(
        `方法2の結果サンプル (${sampleItems.length}件):`,
        sampleItems.map((item) => ({
          id: item.content_id,
          title: item.title,
          actress: item.iteminfo?.actress?.map((a) => a.name).join(", "),
        }))
      );
      return response.result.items;
    }
    return [];
  } catch (error) {
    console.error("女優名での検索に失敗:", error);
    return [];
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
  hits: number = 100,
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
    console.log(
      `キーワードで検索: "${keyword}", 取得件数: ${hits}, オプション:`,
      options
    );
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
    if (options.director)
      params.director = encodeURIComponent(options.director);

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
      safeAccess(item.imageURL, "large"),
      safeAccess(item.imageURL, "small"),
      safeAccess(item.imageURL, "list"),
    ].filter(Boolean) as string[],
  };
}
