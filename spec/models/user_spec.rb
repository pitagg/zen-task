require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { create(:user) }

  it "creates a valid user" do
    expect(user).to be_valid
  end

  it "requires a name" do
    user.name = ""
    expect(user).to_not be_valid
  end

  it "requires a password with at least 8 chars" do
    user.password = "1234567"
    expect(user).to_not be_valid
  end

  it "requires a password of maximum 72 chars" do
    user.password = "a" * 72
    user.save!
    user.password = "a" * 73
    expect(user).to_not be_valid
  end

  it "has a unique email" do
    user.save
    second_user = user.dup
    expect(second_user).to_not be_valid
  end
end
