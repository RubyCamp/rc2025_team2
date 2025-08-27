class AddpublishedToOnsens < ActiveRecord::Migration[8.0]
  def change
   add_column :onsens, :published, :boolean, default: true
  end
end
