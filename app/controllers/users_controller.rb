class UsersController < ApplicationController
  # GET /users/:id
  def show
    @user = User.find(params[:id])
    # => app/views/users/show.html
    # debugger
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
   # @user.name  = params[:user][:email]
   # @user.email = params[:user][:password]
    if @user.save # => Validation
      # Success
      # redirect_to user_path(@user)
      redirect_to @user
      flash[:success] = "Welcome to the Sample App!"
      # GET "/users/#{@user.id"}"
    else
      # Failure
      render 'new'
    end
  end
  
  def user_params
    params.require(:user).permit(
      :name, :email, :password, 
      :password_confirmation)
  end
end
