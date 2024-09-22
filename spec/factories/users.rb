FactoryBot.define do
  factory :user do
    name { 'Henry' }
    email { 'henry@domain.com' }
    password { '12345678' }
  end
end
