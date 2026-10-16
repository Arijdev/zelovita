$ErrorActionPreference = 'Stop'

$projectRef = 'hoysixpijdyrbtehpxvt'
$secureToken = Read-Host 'Supabase Personal Access Token' -AsSecureString
$tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)

try {
  $accessToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer)
  $template = @{
    mailer_subjects_confirmation = 'Your Zelovita verification code'
    mailer_templates_confirmation_content = '<h2>Confirm your email</h2><p>Enter this 6-digit code in the Zelovita signup screen:</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p><p>This code expires according to your Supabase Auth email OTP settings.</p>'
  } | ConvertTo-Json -Compress

  Invoke-RestMethod `
    -Method Patch `
    -Uri "https://api.supabase.com/v1/projects/$projectRef/config/auth" `
    -Headers @{ Authorization = "Bearer $accessToken" } `
    -ContentType 'application/json' `
    -Body $template | Out-Null

  Write-Output 'Supabase Confirm signup template updated to send a 6-digit OTP.'
} catch {
  Write-Error 'Could not update the Supabase email template. Check the access token, project permissions, and Supabase API response.'
  exit 1
} finally {
  if ($tokenPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
  }
  $accessToken = $null
  $secureToken.Dispose()
}