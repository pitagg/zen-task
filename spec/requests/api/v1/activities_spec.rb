require 'rails_helper'

RSpec.describe "Activities", type: :request do
  let!(:user) { create(:user) }
  let!(:project) { create(:project, user: user) }
  let!(:activities) { create_list(:activity, 5, project: project, user: user) }
  let(:activity_id) { activities.first.id }
  let(:valid_headers) { valid_header_for(user) }
  let(:invalid_headers) { { 'Content-Type' => 'application/json' } }


  describe 'GET /projects/:project_id/activities' do
    context "when the user is authenticated" do
      before { get "/api/v1/projects/#{project.id}/activities", headers: valid_headers }

      it 'returns all activities' do
        expect(json_body.size).to eq(5)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the project does not exist' do
      before { get "/api/v1/projects/0/activities", headers: valid_headers }

      it 'returns a not found message' do
        expect(response.body).to match(/Project not found/)
      end

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end
    end

    context 'when the user is not authenticated' do
      before { get "/api/v1/projects/#{project.id}/activities", headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'GET /projects/:project_id/activities/:id' do
    context "when the user is authenticated" do
      before { get "/api/v1/projects/#{project.id}/activities/#{activity_id}",
        headers: valid_headers }

      context 'when the activity exists' do
        it 'returns the activity' do
          expect(json_body['id']).to eq(activity_id)
        end

        it 'returns status code 200' do
          expect(response).to have_http_status(200)
        end
      end

      context 'when the activity does not exist' do
        let(:activity_id) { 0 }

        it 'returns a not found message' do
          expect(response.body).to match(/Activity not found/)
        end

        it 'returns status code 404' do
          expect(response).to have_http_status(404)
        end
      end
    end

    context 'when the user is not authenticated' do
      before { get "/api/v1/projects/#{project.id}/activities/#{activity_id}",
        headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'POST /projects/:project_id/activities' do
    let(:valid_attributes) do
      fields = [ :name, :start_date, :end_date, :completed ]
      build(:activity, name: "New Activity").slice(*fields).to_json
    end
    let(:post_path) { "/api/v1/projects/#{project.id}/activities" }

    context "when the user is authenticated" do
      context 'when the request is valid' do
        before { post post_path, params: valid_attributes, headers: valid_headers }

        it 'creates an activity' do
          expect(json_body['name']).to eq('New Activity')
          expect(json_body['completed']).to eq(false)
        end

        it 'returns status code 201' do
          expect(response).to have_http_status(201)
        end
      end

      context 'when the request is invalid' do
        let(:invalid_attributes) { { name: nil }.to_json }
        before { post post_path, params: invalid_attributes, headers: valid_headers }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns a validation failure message' do
          expect(response.body).to match(/can't be blank/)
        end
      end
    end

    context 'when the user is not authenticated' do
      before { post post_path, params: valid_attributes, headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'PATCH /projects/:project_id/activities/:id' do
    let(:valid_attributes) { { name: 'Updated Activity' }.to_json }
    let(:patch_path) { "/api/v1/projects/#{project.id}/activities/#{activity_id}" }

    context "when the user is authenticated" do
      context 'when the activity exists' do
        before { patch patch_path, params: valid_attributes, headers: valid_headers }

        it 'updates the activity' do
          expect(json_body['name']).to eq('Updated Activity')
        end

        it 'returns status code 200' do
          expect(response).to have_http_status(200)
        end
      end

      context 'when the request is invalid' do
        let(:invalid_attributes) { { name: nil }.to_json }
        before { patch patch_path, params: invalid_attributes, headers: valid_headers }

        it 'returns status code 422' do
          expect(response).to have_http_status(422)
        end

        it 'returns a validation failure message' do
          expect(response.body).to match(/can't be blank/)
        end
      end

      context 'when the activity does not exist' do
        let(:activity_id) { 0 }
        before { patch patch_path, params: valid_attributes, headers: valid_headers }

        it 'returns a not found message' do
          expect(response.body).to match(/Activity not found/)
        end

        it 'returns status code 404' do
          expect(response).to have_http_status(404)
        end
      end
    end

    context 'when the user is not authenticated' do
      before { patch patch_path, params: valid_attributes, headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end

  describe 'DELETE /projects/:project_id/activities/:id' do
    let(:delete_path) { "/api/v1/projects/#{project.id}/activities/#{activity_id}" }

    context "when the user is authenticated" do
      before { delete delete_path, headers: valid_headers }

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end

      context 'when the activity does not exist' do
        let(:activity_id) { 0 }
        before { delete delete_path, headers: valid_headers }

        it 'returns a not found message' do
          expect(response.body).to match(/Activity not found/)
        end

        it 'returns status code 404' do
          expect(response).to have_http_status(404)
        end
      end
    end

    context 'when the user is not authenticated' do
      before { delete delete_path, headers: invalid_headers }
      it_behaves_like :unauthenticated
    end
  end
end
