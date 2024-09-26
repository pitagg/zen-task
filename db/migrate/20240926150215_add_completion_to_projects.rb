class AddCompletionToProjects < ActiveRecord::Migration[7.2]
  def change
    add_column :projects, :completion, :decimal, precision: 6, scale: 5, default: 0
    add_column :projects, :completion_date, :date
  end
end
