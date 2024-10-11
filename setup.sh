# Install Dependencies & Build Package
echo "🏁 Initiating Setup..."
echo "Installing Dependencies & Building Shared Package 🛠️"
yarn
yarn shared

# Link the package
echo "Linking Package... 🔗"
cd packages/shared/dist
yarn link

echo "Linking with Server... 🖥️"
cd ../../../apps/server
yarn link @ecom-mern/shared

echo "Linking with Client.. .💻"
cd ../client
yarn link @ecom-mern/shared

echo " ✅ Setup Complete! 🎉🎉🎉"