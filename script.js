function updateChart() {
  const ticker = document.getElementById("tickerInput").value || "NASDAQ:AAPL";
  document.getElementById("tradingview_chart").innerHTML = "";

  // Save to history
  let history = JSON.parse(localStorage.getItem("tickerHistory") || "[]");
  if (!history.includes(ticker)) {
    history.unshift(ticker);
    if (history.length > 5) history.pop();
    localStorage.setItem("tickerHistory", JSON.stringify(history));
    renderHistory();
  }

  new TradingView.widget({
    width: "100%",
    height: 500,
    symbol: ticker,
    interval: "D",
    timezone: "Etc/UTC",
    theme: localStorage.getItem("theme") || "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#0f0f0f",
    enable_publishing: false,
    hide_top_toolbar: true,
    container_id: "tradingview_chart"
  });
}

function renderHistory() {
  const select = document.getElementById("tickerHistory");
  select.innerHTML = '<option value="">Recent tickers</option>';
  const history = JSON.parse(localStorage.getItem("tickerHistory") || "[]");
  history.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });
}

function loadFromHistory() {
  const ticker = document.getElementById("tickerHistory").value;
  if (ticker) {
    document.getElementById("tickerInput").value = ticker;
    updateChart();
  }
}