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
  User.create!(
    name: "User #{i}",
    email: "user_#{i}@domain.com",
    password: "12345678"
  )
end
@user_1 = User.find(1)

# Add projects to User 1
(1..5).each_with_index do |i|
  @user_1.projects.create!(
    name: "Project #{i}",

    # Each project starts 14 days after the previous one
    start_date: Date.today + (i * 14),

    # Ends 14 days after the start.
    end_date: Date.today + ((i + 1) * 14)
  )
end

# Add activities to Project 1 and 2
Project.find(1, 2).each_with_index do |project|
  (1..5).each_with_index do |i|
    project.activities.create!(
      user: project.user,
      name: "Activity #{i} de #{project.name}",
      completed: (project.id + i).odd?,

      # Each activity starts 7 days after the previous one
      start_date: Date.today + (i * 7),
      # Ends 7 days after the start.
      end_date: Date.today + ((i + 1) * 7)
    )
  end
end
