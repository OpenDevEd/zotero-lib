#!/bin/bash

# Add all changes to the Git index
git add .

# Prompt the user for a commit message
message="$1"

# Create a new commit with the specified message
git commit -m "$message"

# Push the changes to the remote repository
git push origin cleaning-lib
