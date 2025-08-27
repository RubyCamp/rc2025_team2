class OnsensController < ApplicationController
  before_action :set_onsen, only: %i[ show ]
  # GET /onsens or /onsens.json
  def index
    # Strong Parametersで安全なパラメータのみ許可
    @search_params = params.permit(:q, :tags)

    # モデルの検索メソッドを呼び出し、新しい順でソート
    #     onsensテーブルのカラムに対応付けた情報すべてを@Onsens(要するにグローバル変数)にぶちこむ
    #     ので、onsens.nameで名前、onsens.idでid、というように情報を取り出せる(らしい)
    #     でも画像はただの文字データではないのでonsen.imageとやってもデータを持ってこられるわけではない(Active Storageを使わなきゃ)
    @onsens = Onsen.search(@search_params).order(created_at: :desc)

    @onsens_for_map = @onsens.map do |onsen|
      onsen.as_json.merge(
        image_url: if onsen.images.attached?
                     url_for(onsen.images.first.representation(resize_to_limit: [100, 100]))
                   else
                     nil
                   end
      )
    end
  end

  # GET /onsens/1 or /onsens/1.json
  def show
    @reviews = @onsen.reviews.order(created_at: :desc)
  end

  private
    def set_onsen
      @onsen = Onsen.find(params[:id])
    end
end
