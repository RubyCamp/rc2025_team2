class AddOpenHoursToOnsens < ActiveRecord::Migration[8.0]
  def change
    add_column :onsens, :open_hours, :string
  end
end
