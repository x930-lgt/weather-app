import { getCoordinates, getWeather } from "./weatherApi";

const cityInput = document.getElementById("cityInput") as HTMLInputElement;
const buttonSearch = document.getElementById("buttonSearch") as HTMLButtonElement;
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const cityNameEl = document.getElementById("cityName");
const weatherEl = document.getElementById("weather");
const temperatureEl = document.getElementById("temperature");
const windspeedEl = document.getElementById("windspeed");

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

  resultEl!.style.display = "block";
  cityNameEl!.textContent = location.name;
  weatherEl!.textContent = weatherDescriptions[weather.weatherCode] ?? "天気情報なし";
  temperatureEl!.textContent = weather.temperature;
  windspeedEl!.textContent = weather.windSpeed;
}

/**
 * 天気検索を実行し、検索状態に応じて画面を更新する
 *
 * 検索中はボタンを無効化し、検索完了後に再度有効化する
 */
async function handleSearch() {
  statusEl!.textContent = "取得中...";
  statusEl!.style.color = "gray";
  resultEl!.style.display = "none";
  buttonSearch.disabled = true;

  try {
    await searchWeather();
    // 検索成功
    statusEl!.textContent = "取得完了！";
    statusEl!.style.color = "green";

  } catch (error) {

    statusEl!.textContent =
      error instanceof Error ? error.message : "エラーが発生しました";
    statusEl!.style.color = "red";
    resultEl!.style.display = "none";
  } finally {
    buttonSearch.disabled = false;
  }

}
// 検索ボタンのクリックで天気検索を実行
buttonSearch.addEventListener("click", handleSearch);

// Enterキーでも天気検索を実行
cityInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

