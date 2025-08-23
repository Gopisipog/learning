
# Using PowerShell to extract text
$ppt = New-Object -ComObject PowerPoint.Application
$presentation = $ppt.Presentations.Open("c:\Users\gopic\Documents\augment-projects\coding\Top-500-DotNet-Interview-Questions-Part-I.pptx")
# Then extract slide content

