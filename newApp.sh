#!/bin/sh
PATH_APP="/home/runner/work/api-service-order/api-service-order"
FILE_FLY="$PATH_APP/fly.toml"
FILE_DCKR="$PATH_APP/Dockerfile"
NAME_APP="whtsb-api-service-order-v1"
echo "Start of script...$APP"
echo NAME_APP $NAME_APP
touch "$PATH_APP/fly_temp.toml"
sed -i "s%nombreApp%$NAME_APP%g" $FILE_FLY
cp $FILE_FLY "$PATH_APP/fly_temp.toml"
rm $FILE_FLY
flyctl launch --name $NAME_APP --region qro --path $PATH_APP --dockerfile $FILE_DCKR --org whatsbotsm --no-deploy
cp "$PATH_APP/fly_temp.toml" $FILE_FLY