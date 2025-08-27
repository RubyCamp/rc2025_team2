# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Onsen.create!(name: "温泉の名前1", geo_lat: 35.4637, geo_lng: 133.0635, description: "説明", tags: "サウナ", fee: 10000, open_hours: "8:00", close_hours: "18:00")
Onsen.create!(name: "温泉の名前2", geo_lat: 35.4750768, geo_lng: 133.0507436, description: "説明", tags: "サウナ", fee: 10000, open_hours: "10:00", close_hours: "20:00")
