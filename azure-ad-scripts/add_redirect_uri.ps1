# ObjectId for application from App Registrations in your AzureAD
$appObjectId = "a7bc2bfc-c74d-4a15-8a51-4323d3ae13bc"

$app = Get-AzureADApplication -ObjectId $appObjectId

# reply URL to add
$newURL = "https://centros-347316.et.r.appspot.com/redirect"

# Existing reply URLs list
$replyURLList = $app.ReplyUrls;

$replyURLList.Add($newURL)

Set-AzureADApplication -ObjectId $app.ObjectId -ReplyUrls $replyURLList