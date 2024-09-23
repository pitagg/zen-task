FactoryBot.define do
  factory :activity do
    name { "MyString" }
    start_date { "2024-09-23" }
    end_date { "2024-09-23" }
    completed { false }
    project { nil }
    user { nil }
  end
end
