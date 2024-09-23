class Activity < ApplicationRecord
  belongs_to :project
  belongs_to :user
  validates_presence_of :name, :start_date, :end_date, :user
  validates :end_date, comparison: { greater_than_or_equal_to: :start_date }

  before_save :update_end_date

  private

  def update_end_date
    return unless completed && self.changes[:completed]
    self.end_date = Date.today
  end
end
