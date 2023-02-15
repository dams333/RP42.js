echo "RP42 installer!"
read -p "Choose a name for the folder where the app will be installed (Default: RP42): " folder_name
if [ -z "$folder_name" ]; then
	folder_name="RP42"
fi

folder_name=$HOME/$folder_name

mkdir -p $folder_name
cp -r app $folder_name

echo "Please go to https://profile.intra.42.fr/oauth/applications and create a new application with the following settings:"
echo "- Name: [whatever you want]"
echo "- Redirect URI: http://fake.url"
echo "- Scopes: Access the user public data"
echo ""

while [ -z "$client_id" ]; do
	read -p "Copy the UID and paste it here: " client_id
done

while [ -z "$client_secret" ]; do
	read -p "Copy the SECRET and paste it here: " client_secret
done

cd  $folder_name/app

cat << EOF > .env
CLIENT_ID=$client_id
CLIENT_SECRET=$client_secret
EOF

echo "Installing dependencies..."
npm install --silent
echo "Successfully installed RP42!"

read -p "Do you want to paste the auto start command in your shell config file? (y/n): " auto_start
if [ "$auto_start" = "y" ]; then
	read -p "What is your shell file config where paste the start command (Default: .zshrc): " shell_file
	if [ -z "$shell_file" ]; then
		shell_file=".zshrc"
	fi
	shell_file=$HOME/$shell_file
	echo >> $shell_file "! pgrep RP42 > /dev/null && (cd $folder_name/app/ && nohup node index.js 2>&1 > /dev/null &) 2>&1 > /dev/null"
	echo >> $shell_file "true"
fi

echo "Successfully installed RP42!"
read -p "Do you want to start RP42 now? (y/n): " start
if [ "$start" = "y" ]; then
	(nohup node index.js 2>&1 > /dev/null &) 2>&1 > /dev/null
	echo "RP42 started!"
fi

echo "You can now close this terminal and RP42 will start automatically when you start your shell."