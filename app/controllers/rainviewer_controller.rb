# app/controllers/rainviewer_controller.rb
class RainviewerController < ApplicationController
  require "net/http"
  require "uri"
  require "json"

  # GET /rainviewer/proxy.json
  def proxy
    url = URI.parse("https://api.rainviewer.com/public/weather-maps.json")
    response = Net::HTTP.get(url)
    data = JSON.parse(response)

    # 必要に応じて過去/予報フレームを安全にフィルター
    data["past"] ||= []
    data["forecast"] ||= []

    render json: data
  rescue => e
    render json: { past: [], forecast: [], error: e.message }
  end
end
