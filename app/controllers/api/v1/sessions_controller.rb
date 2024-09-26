class Api::V1::SessionsController < Api::V1::ApplicationController
  before_action :authorize_request, only: :show

  def create
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JwtService.encode(user_id: user.id)
      render json: { token: token }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def show
    render json: @current_user.slice(:name, :email), status: :ok
  end
end
