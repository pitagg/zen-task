require 'rails_helper'

RSpec.describe Activity, type: :model do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }
  let(:activity) { build(:activity, user: user, project: project) }

  it "creates a valid activity" do
    expect(activity).to be_valid
  end

  it "requires a name" do
    activity.name = ""
    expect(activity).to_not be_valid
  end

  it "requires a start date" do
    activity.start_date = nil
    expect(activity).to_not be_valid
  end

  it "requires an end date" do
    activity.end_date = nil
    expect(activity).to_not be_valid
  end

  it 'prevents end date before start date' do
    activity.update(start_date: Date.today, end_date: Date.yesterday)
    expect(activity.errors[:end_date]).to include(match(/must be greater than/))
  end

  it "belongs to a user" do
    activity.user = nil
    expect(activity).to_not be_valid
  end

  it "belongs to a project" do
    activity.project = nil
    expect(activity).to_not be_valid
  end

  ### This is weird as the activiy can be `uncompleted`, loosing the original end_date.
  ### TODO: Maybe create another field `completed_at` keeping the original end_date.
  # context 'when completed is updated to true' do
  #   it 'updates the end_date to today' do
  #     activity.update!(start_date: Date.today - 5, end_date: Date.today + 10)
  #     activity.update(completed: true)
  #     expect(activity.end_date).to eq(Date.today)
  #   end
  # end

  # context 'when completed is not updated to true' do
  #   it 'does not update the end_date' do
  #     initial_end_date = activity.end_date
  #     activity.update(name: 'Updated Activity')
  #     expect(activity.end_date).to eq(initial_end_date)
  #   end
  # end
end
