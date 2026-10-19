---
theme: ./theme
title: 隔壁電站的資料，能幫我們預測太陽能發電嗎？
colorSchema: light
aspectRatio: 16/9
canvasWidth: 980
duration: 15min
timer: countdown
layout: cover
kicker: AI × 太陽能預測
meta: 第 X 組 · 組員姓名 · 2026
topics:
  - label: 本站歷史
    color: blue
  - label: 鄰站線索
    color: red
  - label: AI 預測模型
    color: green
---

# 隔壁電站的資料，<br>能幫我們預測太陽能發電嗎？

從單一電站的發電曲線，到 AI 的多場址預測

<SolarMotif />

<style>
.slidev-layout.cover h1 {
  font-size: 58px;
}
</style>

<!--
【P1｜0:20】
今天我們只回答一個問題：AI 如何利用不同太陽能電站的發電紀錄，預測接下來的發電量？
不需要先介紹綠能發展史，直接進入問題。
-->

---
layout: figure
kicker: 問題背景
clicks: 1
---

# 我們能知道這座電站一小時後會發多少電嗎？

只知道「現在」的出力，不代表知道「未來」的出力。

::figure::

<PowerCurve :height="300" :until="11" :window="$clicks >= 1" :question="$clicks >= 1" />

<!--
【P2｜0:50】
這是一座電站（之後稱 B 電站）今天到目前為止的發電功率。現在是上午 11 點。
[click] 問題是：一小時後，它會發多少電？
我們手上只有「現在」的出力，這並不代表我們知道「未來」的出力。

銜接：要回答這個問題，先看看發電量為什麼會改變。

（曲線為概念示意，非真實電站資料。）
-->

---
layout: figure-side
kicker: 問題背景
figureTag: 概念示意
clicks: 1
---

# 天上多了一朵雲，<br>發電量就可能改變

- 日照越強，太陽能板的出力越高
- 雲層遮蔽，是出力在短時間內變動的重要原因之一

::figure::

<CloudScene :covered="$clicks >= 1" />

<PowerCurve :width="480" :height="210" :until="$clicks >= 1 ? 19 : 11" :reference="$clicks >= 1" :dip-note="$clicks >= 1 ? '雲層遮蔽' : ''" />

<!--
【P3｜0:50】
太陽能發電受日照條件影響：日照越強，出力越高。
[click] 當一朵雲飄到太陽和電站之間，日照下降，出力就跟著掉下來；雲過去之後，出力又回升。
虛線是「晴天時」大約的出力，實線是今天實際的出力。
雲層遮蔽是短時間出力變動的重要原因之一，但不是唯一原因。

銜接：如果這個變化會發生，那我們為什麼需要提早知道？
-->

---
layout: figure
kicker: 問題背景
figureTag: 概念示意
clicks: 1
---

# 供電安排不能等發電量下降後才開始

預測讓調度人員提前準備其他電源，而不是在變化發生後才應對。

::figure::

<DispatchSketch :plan="$clicks >= 1" />

台電綜合研究所提供調度、運轉單位**未來 48 小時**的風力與太陽光電預測，每小時更新一次。

::source::

資料來源：《台電月刊》第 720 期（2022.12），〈借風引光 用心駕馭臺灣再生能源〉，[p.21](https://service.taipower.com.tw/tpcjournal/TPMM/2022/720/files/basic-html/page23.html)。

<!--
【P4｜0:55】
左邊是未來一小時的預估：模型認為出力會下降。
[click] 如果調度人員提前知道，就能先讓其他電源準備好，讓總供電持續滿足用電需求；
如果等出力真的掉下來才反應，其他電源可能來不及準備。

實際案例：台電綜合研究所會把未來 48 小時的風力與太陽光電預測交給調度、運轉單位使用，每小時更新一次。
（右側供電柱狀圖是概念示意，不是台電的實際調度數據。）

銜接：既然提前知道這麼重要，那要怎麼預測？
-->

---
layout: figure-side
kicker: 鄰近電站
figureTag: 概念示意
figureWidth: 52%
clicks: 1
---

# 最直覺的預測：<br>先看自己的歷史紀錄

時間序列預測（Time-series Forecasting）

- 用本站過去的出力，推估接下來的出力
- 昨天、前天的曲線，提供一天出力的大致形狀

> 但只看本站，看不到周圍的天氣變化。

::figure::

<PowerCurve :width="480" :height="300" :until="11" window question :history="$clicks >= 1" />

<!--
【P5｜0:50】
回到 B 電站。最直覺的做法是看它自己的歷史紀錄。
[click] 灰線是昨天和前天的曲線。時間序列預測（Time-series Forecasting）就是利用過去的出力資料，建立對未來的預測。
但歷史只能告訴我們「通常」長什麼樣子，今天會不會有一朵雲飄過來，只看本站是看不出來的——它缺少周圍天氣變化的空間線索。

銜接：如果那個變化其實已經發生在其他地方呢？
-->

---
layout: figure
kicker: 鄰近電站
figureTag: 概念示意
clicks: 1
---

# B 還沒變，但附近的 A 已經開始下降了

如果雲正往 B 的方向移動，A 的變化就可能是 B 未來出力的線索。

::figure::

<TwoStations :drift="$clicks >= 1" />

<!--
【P6｜0:55】
現在加入第二座電站 A。上午 11 點，A 的上空有一片雲，A 的出力已經開始下降；B 還維持原本的出力。
[click] 假設雲繼續往 B 的方向移動，那麼 A 剛剛發生的變化，就可能是 B 接下來出力的線索。

注意：這一頁是概念示意。我們沒有宣稱兩站之間必然有固定的先後關係——雲可能改變方向、變薄或消散。

銜接：只有兩座站還不夠，我們把更多電站放在一起看。
-->

---
layout: figure-side
kicker: 鄰近電站
figureTag: 概念示意
clicks: 1
---

# 把 A、B、C 的<br>發電曲線放在一起

- 不同位置的紀錄，對齊**同一條時間軸**
- 同一片雲造成的下降，可能**依序**出現在不同電站
- 這種**時空關係**，是只看單一電站時看不到的

> 真實資料中，先後關係不一定固定。

::figure::

<StationCurves :aligned="$clicks >= 1" />

::source::

概念參考：Simeunović et al.（2021），[§I](https://arxiv.org/pdf/2107.13875#page=2)；Verdone et al.（2025），[§2.2.2 多場址預測](https://iris.uniroma1.it/retrieve/e7979c06-658a-46ff-8752-2ee679e4f960/Verdone_Review_2025.pdf#page=5)。

<!--
【P7｜1:00】
這是 A、B、C 三座電站同一天的發電曲線，放在同一條時間軸上。
[click] 用垂直參考線對齊每座站出力最低的時間，會看到同一片雲造成的下降，依序出現在 A、B、C。
把不同位置的資料放在同一時間軸，就有機會發現單站資料看不到的時空關係。這就是「多場址預測（Multi-site Forecasting）」的出發點。

銜接：三座電站我們可以用眼睛觀察；如果是三百座呢？
-->

---
layout: figure-side
kicker: 鄰近電站
figureTag: 示意分布，非實際站點位置
clicks: 1
---

# 當電站從 3 座<br>變成 304 座

研究案例：Simeunović et al.（2021）

- 瑞士 **304 座真實光電站**的發電紀錄
- 每 **15 分鐘**一筆，涵蓋 2016–2018 年
- 同時利用站點之間的關係與時間變化，預測未來出力

> 論文把光電站看成一張密集的「虛擬氣象站」網路。

::figure::

<NodeCloud :expanded="$clicks >= 1" />

::source::

Simeunović et al.（2021），Abstract、§IV-A Datasets，[PDF pp.2、6](https://arxiv.org/pdf/2107.13875#page=6)。

<!--
【P8｜0:45】
[click] 當電站從 3 座變成 304 座，就不可能再用眼睛一條一條比對。
這是我們今天深入分析的研究：Simeunović 等人在 2021 年使用瑞士 304 座真實光電站、每 15 分鐘一筆的發電資料，研究如何同時利用站點間的關係與時間變化預測未來出力。
論文的想法是：每座光電站都像一個「虛擬氣象站」，它的出力反映了當地的日照情況。

（右圖的點位為示意分布；論文提到真實站點分布不均，大致反映人口密度。）

銜接：這麼多條曲線，該怎麼交給 AI 處理？
-->

---
layout: flow
kicker: 模型設計
---

# 我們真正要學習的，是時間與空間的關係

AI 不是直接「看見」未來的雲，而是從資料中學習規律，再估計未來的出力。

::step1::

### 歷史資料

<FlowGlyph kind="history" />

各電站過去的發電紀錄

::step2::

### 模型

<FlowGlyph kind="model" />

學習時間與空間的規律

::step3::

### 未來出力預測

<FlowGlyph kind="forecast" />

各站未來幾小時的出力

<!--
【P9｜0:45】
把前面的 A、B、C 曲線整理成三段式流程：歷史資料 → 模型 → 未來出力預測。
AI 的工作不是直接「看見未來的雲」，而是從大量歷史資料中學習：哪些站的變化常常先發生、變化會怎麼隨時間延續，再產生對未來發電量的估計。

銜接：但電站不是整齊排列的，要怎麼表示站點之間的關係？
-->

---
layout: figure
kicker: 模型設計
clicks: 2
---

# 把每座電站當成一個節點

圖神經網路（Graph Neural Network, GNN）處理的，就是由「節點＋連線」構成的圖。

::figure::

<GraphBuild :stage="$clicks" />

::source::

Simeunović et al.（2021），§III-A：連線以 k 近鄰（k-nearest neighbors）初始化，訓練中學習其權重，[PDF p.5](https://arxiv.org/pdf/2107.13875#page=5)。

<!--
【P10｜1:00】
電站散布在不同位置，不像圖片的像素那樣排成整齊的格子。所以研究把每座電站表示成圖（Graph）上的一個節點。
[click] 第一步，先依地理距離，把每座站和最近的幾個鄰站連起來。
[click] 第二步，模型在訓練過程中調整部分連線的權重，用來表示站點之間的關係強弱——例如地形或距離帶來的差異。
這裡的連線代表資料上的關係，不是實際的輸電線路。

銜接：有了電站之間的關係，接下來還需要理解它們怎麼隨時間變化。
-->

---
layout: figure
kicker: 模型設計
figureTag: 教學簡化圖
clicks: 3
---

# GCLSTM：同時學習空間關係與時間變化

Graph Convolution（圖卷積）＋ LSTM（長短期記憶網路）

::figure::

<GclstmDiagram :stage="$clicks" />

非原論文完整架構：原文為編碼器–解碼器（encoder–decoder），圖卷積取代 LSTM 閘門中的矩陣乘法。

::source::

Simeunović et al.（2021），§III-A、Eq.(7)、Fig. 1，[PDF pp.4–5](https://arxiv.org/pdf/2107.13875#page=4)。

<!--
【P11｜1:15】整場唯一需要較多技術解釋的頁面
左邊是每座電站的輸入：過去的發電功率、前兩天的平均出力（移動平均），以及依位置與時間計算出的晴空輻照度（Clear-sky Irradiance）。這套模型不需要外部的數值天氣預報（NWP）作為輸入。
[click] 長短期記憶網路（Long Short-Term Memory, LSTM）沿著時間一步一步更新它的「記憶」，處理時間上的變化。
[click] 圖卷積（Graph Convolution）放在 LSTM 的運算裡面：每一步更新時，都會混合鄰近電站的資訊，處理空間關係。
注意：兩者不是先後獨立的兩個模型，圖卷積是嵌在 LSTM 單元之中的。
[click] 最後一次輸出各站未來 6 小時、共 24 步的出力預測。

銜接：架構看起來合理，但我們怎麼知道它真的有用？
-->

---
layout: figure
kicker: 實驗結果
figureTag: 概念示意
clicks: 2
---

# 不能拿已經學過的資料，證明自己預測得準

用 2016 年學習，再拿模型沒看過的 2017 年出題考它。

::figure::

<SplitTimeline :stage="$clicks" />

::source::

Simeunović et al.（2021），§IV-A、§IV-D、§IV-E，[PDF pp.6–7](https://arxiv.org/pdf/2107.13875#page=6)。

<!--
【P12｜1:00】
要證明模型有用，不能拿它已經學過的資料來考它。
GCLSTM 用 2016 年的資料訓練，再用 2017 年、模型沒看過的一整年資料測試。
[click] 放大 2017 年的某一天。站在「現在」這個時間點，模型只看得到過去的出力，要預測接下來 6 小時、每 15 分鐘一步、共 24 步的出力。
[click] 接著揭曉實際出力，把每一步的預測和實際相比，紅線就是誤差。太陽下山後出力本來就是 0，夜間不計入誤差。
把「現在」在 2017 年每 15 分鐘往後移一次，304 座電站各考一遍，這些誤差彙整起來，就是下一頁的 NRMSE。
（右側曲線為概念示意，非真實電站資料。）

比較基準 STAR 採用不同的方式：用最近兩個月的資料擬合，每兩週滾動重新估計一次。
台上不需要展開，但要記得：不能說所有模型都用完全相同的方式訓練。
另外，這是在同一批瑞士站點上的測試，不等於已經在新站點或台灣驗證過。

銜接：那在測試資料上，預測結果如何？
-->

---
layout: figure-side
kicker: 實驗結果
figureWidth: 50%
clicks: 1
---

# AI 真的比較準嗎？<br>讓數據回答

- **NRMSE**：預測誤差 ÷ 該站的最大出力，**越低越好**
- <span v-click>提前 1 小時：GCLSTM **9.93%**，低於 STAR **10.40%**</span>

> STAR 本身也使用多站資料。這是兩種多場址方法的比較，不能解讀成「加入鄰站讓誤差下降 0.47 個百分點」。

::figure::

<BarCompare title="提前 1 小時預測的 NRMSE" subtitle="真實資料集（304 站）· 越低越好" :shown="$clicks >= 1 ? 2 : 1" :bars="[{ label: 'STAR', sub: '多場址自迴歸基準', value: 10.40, color: 'var(--google-gray)' }, { label: 'GCLSTM', sub: '圖神經網路', value: 9.93, color: 'var(--google-blue)' }]" />

::source::

Simeunović et al.（2021），Table I，Real dataset，[PDF p.8](https://arxiv.org/pdf/2107.13875#page=8)。其他時距：15 分鐘時 STAR 略低（7.32% vs 7.36%）；3、6 小時 GCLSTM 較低。

<!--
【P13｜1:15】
評估指標是正規化均方根誤差（Normalized Root Mean Squared Error, NRMSE）：把預測誤差除以該站在 2017 年的最大出力，以百分比表示，越低越好。
NRMSE 是誤差，不能用 100% 減去它換算成「準確率」。

先看比較基準 STAR。
[click] GCLSTM 在提前一小時的預測中，NRMSE 是 9.93%，低於 STAR 的 10.40%。

解讀要準確：STAR 本身也使用多站資料，所以這比較的是兩種多場址方法，不能直接說「加入鄰站資料讓誤差下降 0.47 個百分點」。
其他時距（Table I）：15 分鐘時 STAR 略低（7.32% vs 7.36%），3 小時與 6 小時則是 GCLSTM 較低。原表沒有提供顯著性檢定。

銜接：知道它在平均上表現不錯之後，也要看它在哪裡會出錯。
-->

---
layout: figure-side
kicker: 實驗結果
figureWidth: 50%
figureTag: 概念示意
---

# 但模型也有<br>看不到的事情

- 夜間發電為 0，模型拿不到「今天」的雲況
- 只能依靠晴空輻照度與前兩天的平均出力
- 提前 6 小時預測時，日出後可能**高估**

> Bern 多雲日、提前 6 小時：GCLSTM 的每日 NRMSE 為 **20.87%**，使用天氣預報的 EDLSTM 為 **7.71%**。沒有永遠最好的方法。

::figure::

<SunriseBias />

::source::

Simeunović et al.（2021），§IV-F、Fig. 7(b)、Table II，[PDF pp.9–10](https://arxiv.org/pdf/2107.13875#page=9)。

<!--
【P14｜0:55】
模型也有看不到的事情。夜間的發電量是零，所以在日出前，模型拿不到「今天」任何實際的雲況資訊，只能依靠晴空輻照度和前兩天的平均出力。
原研究發現：在提前 6 小時的預測中，模型在日出後的一段時間可能高估出力；等到開始收到當天的實際發電資料，預測才會明顯往下修正。
在論文舉例的 Bern 多雲日，提前 6 小時的每日 NRMSE：GCLSTM 為 20.87%，而使用數值天氣預報的 EDLSTM 只有 7.71%。
這說明模型不會永遠是最佳方法；在長預測範圍或特殊天氣下，天氣預報資料仍然很重要。

（左圖依論文 Fig. 7(b) 的文字描述重繪，是概念示意，不是原始數據。）

銜接：知道它有用、也知道它會犯錯之後，我們可以把預測放在哪個工作流程裡？
-->

---
layout: flow
kicker: 實際應用
clicks: 1
---

# 提前知道發電量，才能更有依據地安排供電

::step1::

### 預測出力

各站未來數小時的發電量

::step2::

### 安排電源

提前準備其他電源

::step3::

### 持續修正

預測每小時更新一次

::figure::

<PowerCurve :height="220" :until="11" window :forecast="$clicks >= 1" />

::after::

<strong>我們的答案：</strong>讓模型學習多站紀錄與空間關係，取得經過驗證、仍有誤差的預測。

::source::

《台電月刊》第 720 期（2022.12），[p.21](https://service.taipower.com.tw/tpcjournal/TPMM/2022/720/files/basic-html/page23.html)、[p.22](https://service.taipower.com.tw/tpcjournal/TPMM/2022/720/files/basic-html/page24.html)。台電案例說明這類預測有實務用途，不代表台電使用的就是 GCLSTM。

<!--
【P15｜1:15】
在實際的電力系統裡，預測會進入這樣的流程：先預測出力，再讓調度人員安排電源，並隨著新資料持續修正。台電的再生能源預測就是每小時更新一次，交給調度與運轉單位參考。
必須區分：台電案例證明這類預測有實務用途，不代表台電使用的就是我們介紹的 GCLSTM。若要用在台灣，仍需要用本地資料重新評估預測表現與調度效益。

回到開場的那條曲線。
[click] 這次，未來的一小時不再是空白，而是補上了模型的預測——以及它的誤差範圍。

最後回答開場的問題：
「我們無法只憑現在的發電量知道未來；但可以把不同電站的歷史紀錄與空間關係交給模型學習，取得經過驗證、仍有誤差的預測，讓接下來的供電安排更有依據。」
-->

---
layout: default
---

# 參考資料

1. **Simeunović, J., Schubnel, B., Alet, P.-J., & Carrillo, R. E.（2021）**<br>
   *Spatio-temporal graph neural networks for multi-site PV power forecasting.*<br>
   arXiv:2107.13875（作者公開稿 v2，IEEE Transactions on Sustainable Energy 接受稿）。[arxiv.org/abs/2107.13875](https://arxiv.org/abs/2107.13875)<br>
   <span class="ref-use">模型、資料集與測試數字：§III-A、§IV、Table I–II</span>

2. **Verdone, A., Panella, M., De Santis, E., & Rizzi, A.（2025）**<br>
   *A review of solar and wind energy forecasting: From single-site to multi-site paradigm.*<br>
   *Applied Energy, 392*, 126016。[doi.org/10.1016/j.apenergy.2025.126016](https://doi.org/10.1016/j.apenergy.2025.126016)<br>
   <span class="ref-use">多場址預測的概念與研究脈絡：§2.2.2</span>

3. **《台電月刊》第 720 期（2022 年 12 月）**<br>
   〈借風引光 用心駕馭臺灣再生能源〉，pp.21–22。[官方電子版](https://service.taipower.com.tw/tpcjournal/TPMM/2022/720/files/basic-html/page23.html)<br>
   <span class="ref-use">再生能源預測與電力調度的實際應用</span>

<style>
ol {
  margin-top: 1.4rem;
  font-size: 17px;
  line-height: 1.5;
}

li {
  margin-bottom: 1rem;
}

.ref-use {
  color: var(--google-muted);
  font-size: 15px;
}
</style>

<!--
【P16｜0:05】
此頁供查核，不逐項朗讀。
論文頁碼依 arXiv 作者公開稿 PDF 計數；台電頁碼依紙本標示，與電子翻頁序號不同。
-->
