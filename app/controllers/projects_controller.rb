class ProjectsController < ApplicationController
  before_action :authorize_request
  before_action :set_project, only: [:show, :update, :destroy]


  def index
    projects = @current_user.projects
    render json: projects, status: :ok
  end

  def show
    render json: @project
  end

  def create
    project = @current_user.projects.build(project_params)
    if project.save
      render json: project, status: :created
    else
      render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: { errors: @project.errors.full_messages },
        status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
    head :no_content
  end

  private

  def set_project
    @project = @current_user.projects.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Project not found' }, status: :not_found
  end

  def project_params
    params.require(:project).permit(:name, :start_date, :end_date)
  end
end
