// app/javascript/controllers/map_controller.js
import { Controller } from "@hotwired/stimulus";
import L from "leaflet";

// Connects to data-controller="map"
export default class extends Controller {
  static targets = ["container", "slider"];
  static values = { onsens: Array };

  async connect() {
    this.onsens = this._parseOnsensData();
    console.log("Loaded onsens:", this.onsens); // デバッグ用

    this.defaultCoords = [35.468, 133.0483];
    this.center = await this._getCurrentLocation();

    this._initMap();
    this._addOnsens();
    await this._loadRainViewer();
  }

  disconnect() {
    if (this.map) this.map.remove();
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // --- 現在地取得 ---
  async _getCurrentLocation() {
    return new Promise(resolve => {
      if (!navigator.geolocation) return resolve(this.defaultCoords);
      navigator.geolocation.getCurrentPosition(
        pos => resolve([pos.coords.latitude, pos.coords.longitude]),
        () => resolve(this.defaultCoords),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }

  // --- マップ初期化 ---
  _initMap() {
    this.map = L.map(this.containerTarget).setView(this.center, 11.5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    L.marker(this.center).addTo(this.map)
      .bindPopup("現在地").openPopup();
  }

  // --- 温泉マーカー追加 ---
  _addOnsens() {
    this.onsens.forEach(onsen => {
      // lat/lngが正しいか確認
      if (
        typeof onsen.lat !== "number" ||
        typeof onsen.lng !== "number" ||
        isNaN(onsen.lat) ||
        isNaN(onsen.lng)
      ) {
        console.warn("Invalid onsen data skipped:", onsen);
        return;
      }

      let tooltipContent = `<strong>${onsen.name || "名称不明"}</strong>`;
      if (onsen.image_url) {
        tooltipContent += `<br><img src="${onsen.image_url}" alt="${onsen.name}" width="300" style="display: block; margin-top: 5px;">`;
      }

      L.marker([onsen.lat, onsen.lng]).addTo(this.map)
        .bindTooltip(tooltipContent, { direction: 'top', offset: [0, -10] });
    });
  }

  // --- RainViewer 雨雲レーダー ---
  async _loadRainViewer() {
    try {
      const data = await fetch("/rainviewer/proxy.json").then(res => res.json());

      const pastFrames = Array.isArray(data.radar && data.radar.past) ? data.radar.past : [];
      const forecastFrames = Array.isArray(data.radar && data.radar.nowcast) ? data.radar.nowcast : [];
      this.frames = [...pastFrames, ...forecastFrames];

      if (!this.frames.length) return console.warn("RainViewer: no frames available");

      this.radarLayers = this.frames.map(f => {
        if (!f.path) return null;
        const url = f.path.startsWith('//') ? 'https:' + f.path : data.host + f.path;
        return L.tileLayer(url + '/256/{z}/{x}/{y}/2/1_1.png', {
          tileSize: 256,
          opacity: 0.5,
          attribution: '&copy; RainViewer'
        });
      }).filter(layer => layer != null);

      if (!this.radarLayers.length) return console.warn("RainViewer: no valid tile layers");

      this.currentFrame = 0;
      this.radarLayers[this.currentFrame].addTo(this.map);

      if (this.hasSliderTarget) {
        this.sliderTarget.max = this.radarLayers.length - 1;
        this.sliderTarget.value = this.currentFrame;
        this.sliderTarget.addEventListener("input", e => this._onSliderChange(e));
        this.sliderTarget.addEventListener("change", e => this._onSliderChange(e));
      }

      this._startAnimation();

    } catch (e) {
      console.error("RainViewer load failed:", e);
    }
  }

  _startAnimation() {
    this.intervalId = setInterval(() => {
      if (this.sliderActive) return;
      this._showNextFrame();
    }, 1200);
  }

  _showNextFrame() {
    this.map.removeLayer(this.radarLayers[this.currentFrame]);
    this.currentFrame = (this.currentFrame + 1) % this.radarLayers.length;
    this.radarLayers[this.currentFrame].addTo(this.map);
    if (this.hasSliderTarget) this.sliderTarget.value = this.currentFrame;
  }

  _onSliderChange(event) {
    if (!this.radarLayers) return;
    this.sliderActive = true;
    this.map.removeLayer(this.radarLayers[this.currentFrame]);
    this.currentFrame = parseInt(event.target.value);
    this.radarLayers[this.currentFrame].addTo(this.map);
    setTimeout(() => { this.sliderActive = false; }, 1000);
  }

  _parseOnsensData() {
    try {
      return JSON.parse(this.element.dataset.mapOnsens || "[]");
    } catch (e) {
      console.warn("Invalid JSON in data-map-onsens:", e);
      return [];
    }
  }
}



