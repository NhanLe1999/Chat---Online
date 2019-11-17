#Cấu hình các biến môi trường của cơ sở dữ liệu
export DB_CONNECTION=mongodb
export DB_HOST=localhost
export DB_PORT=27017
export DB_NAME=chat_online
export DB_USERNAME=""
export DB_PASSWORD=""

#Cấu hình các biến môi trường của ứng dụng
export APP_HOST=localhost
export APP_PORT=8011

export SESSION_KEY="express.sid"
export SESSION_SECRET="mySecret"

#config admin email account Câu hình biến môi trường của email gửi tin nhắn sau khi đã
#đăng ký tài khoản thành công
export MAIL_USER=Leminhquanyka@gmail.com
export MAIL_PASSWORD=16101999yka
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587

#config facebook login app Cấu hình biến môi trường của facebook khi nhập tài khoản bằng facebook
export FB_APP_ID=2514898115245060
export FB_APP_SECRET=6dbb365dc8036c5cb8815090e4ae1d22
export FB_CALLBACK_URL=https://localhost:8011/auth/facebook/callback

#config google login app Cấu hình biến môi trường của google khi đăng nhập bằng google
export GG_APP_ID=851127789454-j2klskqu53v43p0uqj0v0t1p0216cer1.apps.googleusercontent.com
export GG_APP_SECRET=lBGfQAQnvOEY5KPldcP9biCc
export GG_CALLBACK_URL=https://localhost:8011/auth/google/callback
