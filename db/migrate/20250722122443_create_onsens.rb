class CreateOnsens < ActiveRecord::Migration[8.0]
  def change
    create_table :onsens do |t|
      t.string :name
      t.decimal :geo_lat
      t.decimal :geo_lng
      t.text :description
      t.string :tags
      t.integer :fee
      t.time :open_hours
      t.time :close_hours

      t.timestamps
    end
  end
end
