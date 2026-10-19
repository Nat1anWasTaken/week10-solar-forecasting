# 隔壁電站的資料，能幫我們預測太陽能發電嗎？

**從單一電站的發電曲線，到 AI 的多場址預測**

《自然智慧與人工智慧導論》第 10 週報告簡報。以 Slidev 製作，共 16 頁，報告時間約 15 分鐘。

**線上觀看：** <https://nat1anwastaken.github.io/week10-solar-forecasting/>

## 報告主旨

太陽能出力會隨雲層快速變動，而電網調度需要提前知道接下來的發電量。只看單一電站的歷史紀錄，看不到正在逼近的雲；但附近電站的出力變化，可能正是本站未來的線索。

本報告以 Simeunović et al.（2021）的研究為主要案例：把瑞士 304 座光電站視為圖（Graph）上的節點，用 **GCLSTM**（圖卷積＋長短期記憶網路）同時學習站點間的空間關係與時間變化，預測各站未來 15 分鐘到 6 小時的出力，並檢視它的成效與限制。

> 我們無法只憑現在的發電量知道未來；但可以把不同電站的歷史紀錄與空間關係交給模型學習，取得經過驗證、仍有誤差的預測，讓接下來的供電安排更有依據。

## 簡報架構

| 段落 | 頁次 | 內容 |
| --- | --- | --- |
| 開場 | P1 | 核心問題：AI 如何利用不同電站的紀錄預測發電量 |
| 01 · 問題從哪裡來 | P2–P4 | 一小時後的出力未知、雲層遮蔽造成變動、調度為何需要提前預測（台電案例） |
| 02 · 其他電站為什麼能提供線索？ | P5–P8 | 單站時間序列預測的盲點、鄰站 A 先下降、多站曲線的時空關係、擴展到 304 座電站 |
| 03 · AI 如何把線索變成預測？ | P9–P11 | 歷史資料 → 模型 → 預測、把電站當成圖的節點、GCLSTM 架構 |
| 04 · 模型有沒有用？ | P12–P14 | 2016 訓練／2017 測試、與 STAR 比較 NRMSE（1 小時：9.93% vs 10.40%）、日出後高估的限制 |
| 05 · 回到真實世界 | P15 | 預測、安排電源、持續修正的流程，以及我們的答案 |
| 參考資料 | P16 | 供查核用 |

每一頁的講稿、建議時間與頁間銜接都寫在 `slides.md` 的 presenter notes 中，可在演講者模式（`/presenter`）查看。

## 參考資料

1. Simeunović, J., Schubnel, B., Alet, P.-J., & Carrillo, R. E. (2021). *Spatio-temporal graph neural networks for multi-site PV power forecasting.* arXiv:2107.13875. <https://arxiv.org/abs/2107.13875>
2. Verdone, A., Panella, M., De Santis, E., & Rizzi, A. (2025). *A review of solar and wind energy forecasting: From single-site to multi-site paradigm.* *Applied Energy, 392*, 126016. <https://doi.org/10.1016/j.apenergy.2025.126016>
3. 《台電月刊》第 720 期（2022 年 12 月），〈借風引光 用心駕馭臺灣再生能源〉，pp.21–22。[官方電子版](https://service.taipower.com.tw/tpcjournal/TPMM/2022/720/files/basic-html/page23.html)

簡報中標示「概念示意」的圖表為教學用重繪，並非真實電站資料；論文數字皆附上章節與頁碼出處。

## 本機執行

需要 Node.js 24 與 pnpm。

```bash
pnpm install
pnpm run dev        # 開啟 http://localhost:3030
```

建置與匯出：

```bash
pnpm run build                                              # 輸出靜態網站至 dist/
pnpm exec slidev export slides.md --output week10-a-2.pdf   # 匯出 PDF
pnpm exec slidev export slides.md --format png --output week10-a-2
```

匯出 PDF／PNG 需要 Playwright 的 Chromium（`playwright-chromium` 已列在 devDependencies）。

## 部署

推送到 `main` 後，GitHub Actions（`.github/workflows/deploy.yml`）會自動建置並部署到 GitHub Pages。專案也附有 `netlify.toml`，可直接部署到 Netlify。

## 專案結構

```
slides.md        簡報內容與講稿
components/      簡報用的互動圖表（Vue 元件）
theme/           簡報主題（Google 風格的版面與配色）
public/images/   靜態圖片
```

### 圖表元件

| 元件 | 用途 |
| --- | --- |
| `SolarMotif` | 封面裝飾圖形 |
| `PowerCurve` | 單站發電曲線，可疊加歷史、晴天參考線與預測 |
| `CloudScene` | 雲層遮蔽太陽的示意 |
| `DispatchSketch` | 調度人員提前安排電源的示意 |
| `TwoStations` | A 站先受雲影響、B 站隨後的示意 |
| `StationCurves` | A、B、C 三站曲線對齊同一時間軸 |
| `NodeCloud` | 從 3 座擴展到 304 座電站 |
| `FlowGlyph` | 三段式流程的圖示 |
| `GraphBuild` | 以 k 近鄰建立電站圖並學習連線權重 |
| `GclstmDiagram` | GCLSTM 架構的教學簡化圖 |
| `SplitTimeline` | 訓練／測試資料的時間切分 |
| `BarCompare` | NRMSE 長條圖比較 |
| `SunriseBias` | 日出後高估現象的示意 |
| `SingleImage` | 在一般版面中完整顯示單張圖片 |

### 主題版面

簡報使用 `theme/` 中的自訂主題，除了 Slidev 標準版面外，另提供以 Markdown 撰寫的版面，透過 frontmatter 與具名插槽設定：

| Layout | Frontmatter props | Named slots |
| --- | --- | --- |
| `cover` | `kicker`, `meta`, `background`, `topics` | — |
| `intro`, `section`, `statement`, `fact` | `kicker` | — |
| `end` | `kicker`, `meta` | — |
| `three-cards` | `cardColors`, `cardNumbers` | `card1`, `card2`, `card3` |
| `two-cols-callout` | `calloutKicker` | `left`, `right` |
| `image-left`, `image-right` | `image`, `backgroundSize`, `kicker` | `callout` |
| `code-palette` | `palette` | — |
| `figure` | `kicker` | `figure`, `source` |
| `figure-side` | `kicker`, `figureWidth` | `figure`, `source` |
| `flow` | `kicker`, `stepColors`, `stepNumbers` | `step1`, `step2`, `step3`, `figure`, `after`, `source` |

頁面樣式可使用 CSS 變數 `--google-blue`、`--google-red`、`--google-yellow`、`--google-green`、`--google-ink`、`--google-muted`、`--google-surface`、`--google-border`、`--google-shadow`。Google Sans 字型為本地託管，來源說明見 [`theme/assets/fonts/SOURCE.md`](theme/assets/fonts/SOURCE.md)。
