function updateChart() {
  const ticker = document.getElementById("tickerInput").value || "NASDAQ:AAPL";
  document.getElementById("tradingview_chart").innerHTML = "";

  new TradingView.widget({
    width: "100%",
    height: 500,
    symbol: ticker,
    interval: "D",
    timezone: "Etc/UTC",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#0f0f0f",
    enable_publishing: false,
    hide_top_toolbar: true,
    container_id: "tradingview_chart"
  });
}