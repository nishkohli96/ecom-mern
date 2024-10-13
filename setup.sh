#!/bin/bash

# Install Dependencies & Build Package
echo "🏁 Initiating Setup..."
echo "Installing Dependencies & Building Shared Package 🛠️"
yarn install --frozen-lockfile

if ! yarn shared; then
  echo "Shared package build failed. Exiting setup."
  exit 1
fi

# Link the package
echo "Linking Package... 🔗"
cd packages/shared/dist || exit
if ! yarn link; then
  echo "Linking shared package failed. Exiting setup."
  exit 1
fi

echo "Linking with Server... 🖥️"
cd ../../../apps/server || exit
if ! yarn link @ecom-mern/shared; then
  echo "Linking with server failed. Exiting setup."
  exit 1
fi

echo "Linking with Client... 💻"
cd ../client || exit
if ! yarn link @ecom-mern/shared; then
  echo "Linking with client failed. Exiting setup."
  exit 1
fi

echo "✅ Setup Complete! 🎉🎉🎉"

