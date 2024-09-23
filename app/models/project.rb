class Project < ApplicationRecord
  belongs_to :user
  validates_presence_of :name, :start_date, :end_date, :user
  validates :end_date, comparison: { greater_than_or_equal_to: :start_date }
  has_many :activities, dependent: :destroy
end
