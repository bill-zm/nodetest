filepath=$(cd "$(dirname "$0")"; pwd)
cd $filepath
NODE_ENV=${1} nohup forever yk_server.js &