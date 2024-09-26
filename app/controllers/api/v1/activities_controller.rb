class Api::V1::ActivitiesController < Api::V1::ApplicationController
  before_action :authorize_request
  before_action :set_project
  before_action :set_activity, only: [ :show, :update, :destroy ]

  # GET /projects/:project_id/activities
  def index
    @activities = @project.activities
    render json: @activities
  end

  # GET /projects/:project_id/activities/:id
  def show
    render json: @activity
  end

  # POST /projects/:project_id/activities
  def create
    @activity = @project.activities.new(activity_params)
    @activity.user = @current_user

    if @activity.save
      render json: @activity, status: :created
    else
      render json: { errors: @activity.errors.full_messages },
        status: :unprocessable_entity
    end
  end

  # PATCH /projects/:project_id/activities/:id
  def update
    if @activity.update(activity_params)
      render json: @activity
    else
      render json: { errors: @activity.errors.full_messages },
        status: :unprocessable_entity
    end
  end

  # DELETE /projects/:project_id/activities/:id
  def destroy
    @activity.destroy
    head :no_content
  end

  private

  def set_project
    @project = @current_user.projects.find(params[:project_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Project not found" }, status: :not_found
  end

  def set_activity
    @activity = @project.activities.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Activity not found" }, status: :not_found
  end

  def activity_params
    params.require(:activity).permit(:name, :start_date, :end_date, :completed)
  end
end
