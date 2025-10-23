function updateChart() {
  const ticker = document.getElementById("tickerInput").value || "NASDAQ:AAPL";
  document.getElementById("tradingview_chart").innerHTML = "";
loadNews(ticker);
  function checkPriceAlert(currentPrice) {
  const alertPrice = parseFloat(document.getElementById("alertPrice").value);
  if (!isNaN(alertPrice) && currentPrice >= alertPrice) {
    document.getElementById("alertMessage").innerHTML = `
      <span style="color: lime; font-weight: bold;">
        🚨 Alert: ${currentPrice} has reached your target of ${alertPrice}!
      </span>
    `;
  } else {
    document.getElementById("alertMessage").innerHTML = "";
  }
}
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
fetch(`https://api.coingecko.com/api/v3/simple/price?ids=apple&vs_currencies=usd`)
  .then(res => res.json())
  .then(data => {
    const price = data.apple?.usd || 0;
    checkPriceAlert(price);
  });

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
async function loadNews(ticker) {
  try {
    const res = await fetch(`https://newsapi.org/v2/everything?q=${ticker}&apiKey=YOUR_API_KEY`);
    const data = await res.json();
    const list = document.getElementById("newsList");
    list.innerHTML = "";

    data.articles.slice(0, 5).forEach(article => {
      const item = document.createElement("li");
      item.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
      list.appendChild(item);
    });
  } catch (err) {
    document.getElementById("newsList").innerHTML = "<li>Failed to load news.</li>";
  }
}

function loadCryptoPrices() {
  fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd")
    .then(res => res.json())
    .then(data => {
      document.getElementById("cryptoTracker").innerHTML = `
        <strong>BTC:</strong> $${data.bitcoin.usd} &nbsp;
        <strong>ETH:</strong> $${data.ethereum.usd}
      `;
    })
    .catch(() => {
      document.getElementById("cryptoTracker").textContent = "Failed to load prices.";
    });
}

function toggleTheme() {
  const isLight = document.getElementById("themeToggle").checked;
  document.body.className = isLight ? "light" : "dark";
  localStorage.setItem("theme", isLight ? "light" : "dark");
  updateChart();
}

// Load everything on page load
window.onload = () => {
  const theme = localStorage.getItem("theme") || "dark";
  document.body.className = theme;
  document.getElementById("themeToggle").checked = theme === "light";
  updateChart();
  renderHistory();
  loadCryptoPrices();
};

// Auto-refresh chart every 5 minutes
setInterval(updateChart, 300000);

// Auto-refresh crypto prices every minute
setInterval(loadCryptoPrices, 60000);