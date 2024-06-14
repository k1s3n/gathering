# This script will open a new terminal in VS Code, navigate to the backend folder, and run npm start

# Simulate pressing Ctrl+Shift+`
Add-Type -AssemblyName System.Windows.Forms

# Function to send keys to the active window
function Send-Keys {
    param (
        [string]$keys
    )
    [System.Windows.Forms.SendKeys]::SendWait($keys)
}

# Wait for a moment to ensure the VS Code terminal opens properly
Start-Sleep -Milliseconds 500

# Simulate pressing Ctrl+Shift+ö
Send-Keys "^+'"

# Wait for a moment to ensure the new terminal is open
Start-Sleep -Seconds 1

# Send the commands to navigate to the backend folder and run npm start
Send-Keys "cd frontend{ENTER}"
Start-Sleep -Milliseconds 500
Send-Keys "npm start{ENTER}"
