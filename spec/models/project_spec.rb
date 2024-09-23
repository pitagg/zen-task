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

  it "prevents an end date smaller than the start date" do
    project.start_date = Date.tomorrow
    project.end_date = Date.today
    expect(project).to_not be_valid
  end

  it "balongs to a user" do
    project.user = nil
    expect(project).to_not be_valid
  end
end
