class User < ApplicationRecord
  has_secure_password
  validates :password, length: { minimum: 8 }
  validates :email, presence: true, uniqueness: true
  validates_presence_of :name

  has_many :projects, dependent: :destroy
end
