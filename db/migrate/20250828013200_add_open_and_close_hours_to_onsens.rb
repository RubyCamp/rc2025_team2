class AddOpenAndCloseHoursToOnsens < ActiveRecord::Migration[7.0]
  def change
    add_column :onsens, :open_hours, :time unless column_exists?(:onsens, :open_hours)
    add_column :onsens, :close_hours, :time unless column_exists?(:onsens, :close_hours)
  end
end
