require 'rails_helper'

RSpec.describe "README", type: :feature do
  it "has the same number of lines in English and Portuguese" do
    readme_lines = File.open(Rails.root.join('README.md')).count
    leaiame_lines = File.open(Rails.root.join('docs/pt/LEIA-ME.md')).count
    expect(leaiame_lines).to eq(readme_lines)
  end

  it "has both English and Portuguese versions updated at same day" do
    readme = File.open(Rails.root.join('README.md'))
    leaiame = File.open(Rails.root.join('docs/pt/LEIA-ME.md'))
    expect(leaiame.mtime.to_date).to eq(readme.mtime.to_date)
  end
end
