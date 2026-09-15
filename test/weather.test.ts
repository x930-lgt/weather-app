import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCoordinates, getWeather } from '../src/weatherApi';

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('getCoordinatesのテスト', () => {
    it("都市名から緯度・経度を取得できる", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [
                        {
                            name: "Osaka",
                            latitude: 12.345,
                            longitude: 678.910
                        }
                    ]
                })
            })
        );

        const result = await getCoordinates("Osaka");

        expect(result.name).toBe("Osaka");
        expect(result.latitude).toBe(12.345);
        expect(result.longitude).toBe(678.910);
    });

    it("存在しない都市名の場合はエラーになる", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: []
                })
            })
        );

        await expect(getCoordinates("存在しない都市")).rejects.toThrow(
            "都市が見つかりませんでした"
        );
    });
});

describe('getWeatherのテスト', () => {
    it("緯度・経度から天気情報を取得できる", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    current: {
                        temperature_2m: 25,
                        weather_code: 3,
                        wind_speed_10m: 3
                    }
                })
            })
        );

        const result = await getWeather(2, 2);

        expect(result.temperature).toBe("気温：25℃");
        expect(result.weatherCode).toBe(3);
        expect(result.windSpeed).toBe("風速 3m/s");
    });

    it("天気情報の取得に失敗した場合はエラーになる", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            ok: false
        }));

        await expect(getWeather(1, 1)).rejects.toThrow(
            "天気情報の取得に失敗しました"
        );
    });
});