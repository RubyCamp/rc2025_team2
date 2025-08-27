class AddOpenHoursAndFeeToOnsens < ActiveRecord::Migration[8.0]
  def change
    add_column :onsens, :open_hours, :string
    add_column :onsens, :fee, :integer
  end
end
