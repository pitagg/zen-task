require 'rails_helper'

RSpec.describe "Projects", type: :request do
  let!(:user) { create(:user) }
  let!(:projects) { create_list(:project, 5, user: user) }
  let(:project_id) { projects.first.id }
  let(:valid_headers) do
    {
      'Authorization' => "Bearer #{JwtService.encode(user_id: user.id)}",
      'Content-Type' => 'application/json'
    }
  end

  let(:invalid_headers) { { 'Content-Type' => 'application/json' } }

  # Prevent repeated examples for every routes
  # Tests use it with `it_behaves_like(:unauthenticated) method
  shared_examples_for :unauthenticated do
    it 'returns a failure message' do
      expect(json_body['error']).to match(/Unauthorized/)
    end

    it 'returns status code 401' do
      expect(response).to have_http_status(401)
    end
  end

  describe "GET /projects" do
    context 'when the user is authenticated' do
      before { get '/projects', headers: valid_headers }

      it 'returns projects' do
        expect(json_body.size).to eq(5)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the user is not authenticated' do
      before { get '/projects', headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'GET /projects/:id' do
    context 'when the user is authenticated' do
      before { get "/projects/#{project_id}", headers: valid_headers }

      it 'returns the project' do
        expect(json_body['id']).to eq(project_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      context 'when the project does not exist' do
        let(:project_id) { 0 }
        before { get "/projects/#{project_id}", headers: valid_headers }

        it 'returns a not found message' do
          expect(response.body).to match(/Project not found/)
        end

        it 'returns status code 404' do
          expect(response).to have_http_status(404)
        end
      end
    end

    context 'when the user is not authenticated' do
      before { get "/projects/#{project_id}", headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'POST /projects' do
    let(:valid_attributes) do
      { name: 'New Project', start_date: '2024-09-01', end_date: '2024-09-30' }.to_json
    end

    context "when the user is authenticated" do
      context 'when the request is valid' do
        before { post '/projects', params: valid_attributes, headers: valid_headers }

        it 'creates a project' do
          expect(json_body['name']).to eq('New Project')
        end

        it 'returns status code 201' do
          expect(response).to have_http_status(201)
        end
      end

      context "when the request is invalid" do
        before do
          invalid_params = { name: "", start_date: "", end_date: "" }.to_json
          post '/projects', params: invalid_params, headers: valid_headers
        end

        it "returns the validations messages" do
          full_messages = user.projects.create.errors.full_messages
          expect(json_body['errors']).to eq(full_messages)
        end

        it "returns status code 422" do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context 'when the user is not authenticated' do
      before { post '/projects', params: valid_attributes, headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'PATCH /projects/:id' do
    let(:valid_attributes) { { name: 'Updated Project' }.to_json }

    context "when the user is authenticated" do
      context 'when the project exists' do
        before do
          patch "/projects/#{project_id}",
            params: valid_attributes,
            headers: valid_headers
        end

        it 'updates the project' do
          updated_project = Project.find(project_id)
          expect(updated_project.name).to eq('Updated Project')
        end

        it 'returns status code 200' do
          expect(response).to have_http_status(200)
        end

        context "when the request is invalid" do
          before do
            patch "/projects/#{project_id}",
              params: { name: "" }.to_json,
              headers: valid_headers
          end

          it "returns the validations messages" do
            expect(json_body['errors']).to eq(["Name can't be blank"])
          end

          it "returns status code 422" do
            expect(response).to have_http_status(:unprocessable_entity)
          end
        end
      end

      context 'when the project does not exist' do
        let(:project_id) { 0 }
        before { patch "/projects/#{project_id}", params: valid_attributes, headers: valid_headers }

        it 'returns a not found message' do
          expect(response.body).to match(/Project not found/)
        end

        it 'returns status code 404' do
          expect(response).to have_http_status(404)
        end
      end
    end


    context 'when the user is not authenticated' do
      before { patch "/projects/#{project_id}", params: valid_attributes, headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'DELETE /projects/:id' do
    context 'when the project exists and the user is authenticated' do
      before { delete "/projects/#{project_id}", headers: valid_headers }

      it 'deletes the project' do
        expect(Project.find_by(id: project_id)).to be_nil
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end

    context 'when the project does not exist' do
      let(:project_id) { 0 }
      before { delete "/projects/#{project_id}", headers: valid_headers }

      it 'returns a not found message' do
        expect(response.body).to match(/Project not found/)
      end

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end
    end

    context 'when the user is not authenticated' do
      before { delete "/projects/#{project_id}", headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end
end
