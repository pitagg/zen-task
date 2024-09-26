FactoryBot.define do
  factory :activity do
    name { "MyString" }
    start_date { Date.today - (1..15).to_a.sample }
    end_date { Date.today + (1..15).to_a.sample }
    completed { false }
    project { nil }
    user { nil }
  end
end
