class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # favorite
  has_many :favorites, dependent: :destroy
  has_many :favorite_onsens, through: :favorites, source: :onsen
end
