SRC_DIR="./frontend/build"
OUTPUT_DIR="./backend/src/frontend"

echo "Found the following";
FILES=`ls ${SRC_DIR}/*`;
echo $FILES
echo ""
echo "Copying"

cp -R $SRC_DIR $OUTPUT_DIR
