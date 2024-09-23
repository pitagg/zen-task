module RequestSpecHelper
  # Parse JSON response to ruby hash
  def json_body
    JSON.parse(response.body)
  end

  def valid_header_for(user)
    {
      'Authorization' => "Bearer #{JwtService.encode(user_id: user.id)}",
      'Content-Type' => 'application/json'
    }
  end

  # This behavior is necessary for all private routes to prevent a privacy issue.
  # It can be used with `it_behaves_like(:unauthenticated) method so the
  # examples below will be performed inside the scope where it was used.
  shared_examples_for :unauthenticated do
    it 'returns a failure message' do
      expect(json_body['error']).to match(/Unauthorized/)
    end

    it 'returns status code 401' do
      expect(response).to have_http_status(401)
    end
  end
end
