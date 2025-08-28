class FavoritesController < ApplicationController
  before_action :authenticate_user!

  def create
    onsen = Onsen.find(params[:onsen_id])
    current_user.favorites.create(onsen: onsen)
    redirect_back fallback_location: root_path
  end

  def destroy
    onsen = Onsen.find(params[:onsen_id])
    favorite = current_user.favorites.find_by(onsen: onsen)
    favorite.destroy if favorite
    redirect_back fallback_location: root_path
  end
end