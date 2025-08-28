class AddOpenHoursToOnsens < ActiveRecord::Migration[8.0]
  def change
    add_column :onsens, :open_hours, :time unless column_exists?(:onsens, :open_hours)
  end
end
