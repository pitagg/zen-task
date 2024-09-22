class ApplicationController < ActionController::API
  def authorize_request
    header = request.headers["Authorization"]
    token = header.split(" ").last if header
    decoded = JwtService.decode(token)
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue ActiveRecord::RecordNotFound, JWT::DecodeError
    render json: { error: "Unauthorized!" }, status: :unauthorized
  end
end
