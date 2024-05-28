#!/bin/bash
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
list_machine=$(flyctl machine list)
# echo $list_machine
a=($(echo "$list_machine" | tr ' ' '\n'))
nm=${a[0]}
echo $nm
dtmn=true
# for ((i=0; i<${#a[@]}; i++)); do echo "$i - ${a[i]}"; done
if [ $nm -eq 1 ] 
    then
        IDMACH="${a[32]}"
        echo "RUN MACHINE: $IDMACH"
    else
        IDMACH="${a[43]}"
        echo "DELETE ID MACHINE: $IDMACH"
        delete_machine=$(flyctl machine destroy $IDMACH --force)
        echo $delete_machine
        dtmn=false
fi
# if [ $nm -ne 1 ] 
#     then
#         IDMACH="${a[32]}"
#         echo "SCALE MACHINE: $IDMACH to 512Mb"
#         scale_machine=$(flyctl scale memory 512)
#         echo $scale_machine
# fi