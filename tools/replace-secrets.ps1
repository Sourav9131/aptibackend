if (Test-Path 'Controllers/userController/orderController.js') {
  $c = Get-Content -Raw 'Controllers/userController/orderController.js'
  $c = $c -replace 'sk_test_[A-Za-z0-9]+' , 'sk_test_REDACTED'
  $c = $c -replace 'rzp_test_[A-Za-z0-9]+' , 'rzp_test_REDACTED'
  $c = $c -replace "key_secret:\s*'[^']*'" , 'key_secret: process.env.RAZORPAY_KEY_SECRET'
  $c = $c -replace "key_id:\s*'[^']*'" , 'key_id: process.env.RAZORPAY_KEY_ID'
  Set-Content 'Controllers/userController/orderController.js' $c
}
