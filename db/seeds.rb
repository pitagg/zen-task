# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


# Add users
(1..5).each_with_index do |i|
  instance_variable_set "@user_#{i}".to_sym, User.create!(
    name: "User #{i}",
    email: "user_#{i}@domain.com",
    password: "12345678"
  )
end

# Add projects to User 1
(1..5).each_with_index do |i|
  instance_variable_set "@project_#{i}".to_sym, @user_1.projects.create!(
    name: "Project #{i}",

    # Each project starts 14 days after the previous one
    start_date: Date.today + (i * 14),

    # Ends 14 days after the start.
    end_date: Date.today + ((i + 1) * 14)
  )
end
