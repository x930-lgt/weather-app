const cityInput = document.getElementById("cityInput") as HTMLInputElement;
const buttonSearch = document.getElementById("buttonSearch") as HTMLButtonElement;
const statusEL = document.getElementById("status");
const resultEL = document.getElementById("result");
const cityNameEL = document.getElementById("cityName");
const weatherEL = document.getElementById("weather");
const temperatureEl = document.getElementById("temperature");
const windspeedEl = document.getElementById("windspeed");


type Location = {
  /** 都市名 */
  name: string;

  /** 緯度 */
  latitude: number;

  /** 経度 */
  longitude: number;
};

type Weather = {
  /** 気温 */
  temperature: string;

  /** 天気コード */
  weatherCode: number;

  /** 風速 */
  windSpeed: string;
};

/**
 * 天気コードを天気の説明文に変換する
 */
const weatherDescriptions: Record<number, string> = {
  0: "☀️ 快晴",
  1: "🌤️ ほぼ快晴",
  2: "⛅ 一部曇り",
  3: "☁️ 曇り",
  45: "🌫️ 霧",
  48: "🌫️ 霧氷",
  51: "🌦️ 霧雨（弱）",
  53: "🌦️ 霧雨",
  55: "🌧️ 霧雨（強）",
  61: "🌧️ 雨（弱）",
  63: "🌧️ 雨",
  65: "🌧️ 雨（強）",
  71: "🌨️ 雪（弱）",
  73: "❄️ 雪",
  75: "❄️ 雪（強）",
  80: "🌦️ にわか雨（弱）",
  81: "🌧️ にわか雨",
  82: "🌧️ にわか雨（強）",
  95: "⛈️ 雷雨",
  99: "⛈️ 雷雨と雹"
};

/**
 * 都市名から緯度・経度を取得する
 *
 * @param cityName - 検索する都市名
 * @returns 都市名、緯度、経度
 * @throws 都市情報の取得に失敗した場合
 * @throws 都市が見つからない場合
 */
async function getCoordinates(cityName: string): Promise<Location> {
  const url: string = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=ja&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("都市情報の取得に失敗しました");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("都市が見つかりませんでした");
  }

  return {
    name: data.results[0].name,
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude
  };
}

/**
 * 緯度・経度から現在の天気情報を取得する
 *
 * @param latitude - 緯度
 * @param longitude - 経度
 * @returns 気温、天気コード、風速
 * @throws 天気情報の取得に失敗した場合
 */
async function getWeather(latitude: number, longitude: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FTokyo&wind_speed_unit=ms`;

  const weatherResponse = await fetch(url);

  if (!weatherResponse.ok) {
    throw new Error("天気情報の取得に失敗しました");
  }

  const weatherData = await weatherResponse.json();

  return {
    temperature: `気温：${weatherData.current.temperature_2m}℃`,
    weatherCode: weatherData.current.weather_code,
    windSpeed: `風速 ${weatherData.current.wind_speed_10m}m/s`
  };
}

/**
 * 入力された都市名から天気情報を検索し、画面に表示する
 *
 * @throws 都市名が入力されていない場合
 */
async function searchWeather() {
  const cityName = cityInput.value.trim();

  if (cityName === "") {
    throw new Error("都市名を入力してください");
  }

  const location = await getCoordinates(cityName);

  const weather = await getWeather(
    location.latitude,
    location.longitude
  );

  resultEL!.style.display = "block";
  cityNameEL!.textContent = location.name;
  weatherEL!.textContent = weatherDescriptions[weather.weatherCode] ?? "天気情報なし";
  temperatureEl!.textContent = weather.temperature;
  windspeedEl!.textContent = weather.windSpeed;
}

/**
 * 天気検索を実行し、検索状態に応じて画面を更新する
 *
 * 検索中はボタンを無効化し、検索完了後に再度有効化する
 */
async function handleSearch() {
  statusEL!.textContent = "取得中...";
  statusEL!.style.color = "gray";
  resultEL!.style.display = "none";
  buttonSearch!.disabled = true;

  try {
    await searchWeather();
    // 検索成功
    statusEL!.textContent = "取得完了！";
    statusEL!.style.color = "green";

  } catch (error) {

    statusEL!.textContent =
      error instanceof Error ? error.message : "エラーが発生しました";
    statusEL!.style.color = "red";
    resultEL!.style.display = "none";
  } finally {
    buttonSearch!.disabled = false;
  }

}
// 検索ボタンのクリックで天気検索を実行
buttonSearch?.addEventListener("click", handleSearch);

// Enterキーでも天気検索を実行
cityInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

