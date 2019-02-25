class UserMailer < ApplicationMailer

  def account_activation(user)
    @user = user
    @greeting = "Hi"
    mail to: user.email  # => return mail object
      # => create    app/views/user_mailer/account_activation.text.erb
      # => create    app/views/user_mailer/account_activation.html.erb
      
  end




  def password_reset
    @greeting = "Hi"

    mail to: "to@example.org"
  end
end
