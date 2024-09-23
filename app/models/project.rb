class Project < ApplicationRecord
  belongs_to :user
  validates_presence_of :name, :start_date, :end_date, :user
  validates :end_date, comparison: { greater_than: :start_date }
end
