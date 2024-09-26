require 'rails_helper'

RSpec.describe Project, type: :model do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }

  it "creates a valid project" do
    expect(project).to be_valid
  end

  it "requires a name" do
    project.name = ""
    expect(project).to_not be_valid
  end

  it "requires a start date" do
    project.start_date = nil
    expect(project).to_not be_valid
  end

  it "requires an end date" do
    project.end_date = nil
    expect(project).to_not be_valid
  end

  it "prevents end date before the start date" do
    project.start_date = Date.tomorrow
    project.end_date = Date.today
    expect(project).to_not be_valid
  end

  it "belongs to a user" do
    project.user = nil
    expect(project).to_not be_valid
  end

  describe "#completion" do
    before do
      create_list(:activity, 6, project: project, user: user)
      create_list(:activity, 4, project: project, user: user, completed: true)
    end

    it "starts with completion equal 0" do
      other_project = create(:project, user: user)
      expect(other_project.completion).to eq(0)
    end

    # TODO: Could expect `to_not make_database_queries` (db-query-matchers gem)
    it "persists the completion percentage based on activities done" do
      expect(project.completion).to eq(0.4) # 40%
    end

    it "updates the completion when the activity is changed" do
      values = [ project.completion ]
      project.activities.complete.first.update!(completed: false)
      values << project.reload.completion
      project.activities.pending.update!(completed: true)
      values << project.reload.completion
      expect(values).to eql([ 0.4, 0.3, 1.0 ])
    end
  end

  describe "#completion_date" do
    before do
      create_list(:activity, 4, project: project, user: user)
      create(:activity, project: project, user: user, end_date: far_future)
    end
    let(:far_future) { Date.today + 5.years }

    it "starts nil" do
      other_project = create(:project, user: user)
      expect(other_project.completion_date).to be_nil
    end

    # TODO: Could expect `to_not make_database_queries` (db-query-matchers gem)
    it "persists the last activity end date" do
      expect(project.completion_date).to eq(far_future)
    end

    it "updates when the activity is changed" do
      expected_dates = [ far_future, far_future - 4.days, far_future - 8.days ]
      dates = []
      activity = project.activities.last
      expected_dates.each do |expected_date|
        activity.update!(end_date: expected_date)
        dates << project.reload.completion_date
      end
      expect(dates).to eql(expected_dates)
    end
  end
end
