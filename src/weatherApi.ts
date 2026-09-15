export type Location = {
    /** 都市名 */
    name: string;
  
    /** 緯度 */
    latitude: number;
  
    /** 経度 */
    longitude: number;
  };
  
  export type Weather = {
    /** 気温 */
    temperature: string;
  
    /** 天気コード */
    weatherCode: number;
  
    /** 風速 */
    windSpeed: string;
  };

/**
 * 都市名から緯度・経度を取得する
 *
 * @param cityName - 検索する都市名
 * @returns 都市名、緯度、経度
 * @throws 都市情報の取得に失敗した場合
 * @throws 都市が見つからない場合
 */
export async function getCoordinates(cityName: string): Promise<Location> {
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
  export async function getWeather(latitude: number, longitude: number): Promise<Weather> {
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