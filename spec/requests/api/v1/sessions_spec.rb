require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  let(:headers) { { 'Content-Type' => 'application/json' } }
  let(:user) { create(:user) }

  let(:valid_credentials) do
    {
      email: user.email,
      password: '12345678'
    }.to_json
  end

  let(:invalid_credentials) do
    {
      email: user.email,
      password: 'wrongpassword'
    }.to_json
  end

  describe 'POST /login' do
    context 'when request is valid' do
      before { post '/api/v1/login', params: valid_credentials, headers: headers }

      it 'returns an authentication token' do
        expect(json_body['token']).not_to be_nil
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when request is invalid' do
      before { post '/api/v1/login', params: invalid_credentials, headers: headers }

      it 'returns a failure message' do
        expect(json_body['error']).to match(/Invalid email or password/)
      end

      it 'returns status code 401' do
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET /me' do
    let(:valid_token) { JwtService.encode(user_id: user.id) }

    describe "when the token is valid" do
      before { get '/api/v1/me', headers: { Authorization: valid_token } }

      it "returns the logged user data" do
        expect(json_body).to eq(user.slice(:name, :email))
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    describe "when the token is invalid" do
      before { get '/api/v1/me', headers: { Authorization: "invalid_token" } }

      it 'returns a failure message' do
        expect(json_body['error']).to match(/Unauthorized!/)
      end

      it 'returns status code 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
end
