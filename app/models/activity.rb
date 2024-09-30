class Activity < ApplicationRecord
  belongs_to :project
  belongs_to :user
  validates_presence_of :user, :name, :start_date
  validates :end_date, comparison: { greater_than_or_equal_to: :start_date }

  after_save :update_project_completion, :update_project_completion_date

  scope :complete, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }

  private

  # OPTIMIZE: Could it be a background job? Would delay the project update.
  def update_project_completion
    total = self.project.activities.count.to_f
    complete = self.project.activities.complete.count.to_f
    project.update! completion: (complete / total).round(2)
  end

  # OPTIMIZE: Could it be a background job? Would delay the project update.
  def update_project_completion_date
    furthest_date = project.activities.maximum :end_date
    project.update! completion_date: furthest_date
  end
end
