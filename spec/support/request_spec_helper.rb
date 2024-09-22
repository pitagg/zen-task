module RequestSpecHelper
  # Parse JSON response to ruby hash
  def json_body
    JSON.parse(response.body)
  end
end
