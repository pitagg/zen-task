FactoryBot.define do
  factory :project do
    name { "Project ABC" }
    start_date { "2024-09-21" }
    end_date { "2024-10-21" }
    user { nil }
  end
end
