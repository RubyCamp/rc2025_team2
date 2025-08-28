import { Controller } from "@hotwired/stimulus"
import L from "leaflet"

// Connects to data-controller="map"
export default class extends Controller {
  static targets = ["container"]
  static values = { onsens: Array }

  connect() {
    this.onsens = this._parseOnsensData();
    console.log(this.onsens);

    this.map = L.map(this.containerTarget).setView([35.468, 133.0483], 11.5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const onsenIcon = L.icon({
      iconUrl: '/onsen.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.onsens.forEach(onsen => {
      // --- ここから追加 ---
      // Tooltipに表示するHTMLを組み立てる
      let tooltipContent = `<strong>${onsen.name}</strong>`;
      // image_urlが存在すれば、imgタグを追加する
      if (onsen.image_url) {
        tooltipContent += `<br><img src="${onsen.image_url}" alt="${onsen.name}" width="300" style="display: block; margin-top: 5px;">`;
      }
      // --- ここまで追加 ---

      // マーカーを作成し、定数 `marker` に格納
      const marker = L.marker([onsen.geo_lat, onsen.geo_lng], { icon: onsenIcon })
        .addTo(this.map)
        .bindTooltip(tooltipContent); // ★変更点: 組み立てたHTMLをTooltipに設定

      // マーカーにクリックイベントを追加 (この部分はそのまま)
      marker.on('click', () => {
        // (中略) ... スクロールとハイライトの処理
        const card = document.getElementById(`onsen-card-${onsen.id}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('shadow-xl', 'ring-2', 'ring-blue-500', 'transition-all');
          setTimeout(() => {
            card.classList.remove('shadow-xl', 'ring-2', 'ring-blue-500');
          }, 2000);
        }
      });
    });
  }

  disconnect() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // === プライベートメソッド（内部処理用） ===

  /**
   * HTML要素から温泉データを取得・パース
   * @returns {Array} 温泉データの配列
   */
  _parseOnsensData() {
    try {
      const rawData = this.element.dataset.mapOnsens || "[]";
      return JSON.parse(rawData);
    } catch (error) {
      console.warn("温泉データのパースに失敗:", error);
      return [];
    }
  }
}
