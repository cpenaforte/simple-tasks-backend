# simple-tasks-backend
Express.js server for Simple Tasks App

# How to run
1. Create *.env* file using *.env.example*
2. Add this lines to your .bashrc file:
```
function dcc() {
  # Use this command to attach to a running container
  # -> use docker-compose notation for container name
  if [ "$1" = "attach" ]; then
    if [ "$#" -ge 2 ] && [[ "${@: -1}" =~ ^[a-zA-Z] ]]; then
      docker attach "${@:2:-1}" "${PWD##*/}_${@: -1}_1"
    else
      docker attach "${@:2}"
    fi

  # Use this command when changing runtime configuration in docker-compose.yml
  elif [ "$1" = "recreate" ]; then
    # https://github.com/mhart/alpine-node/issues/48#issuecomment-430902787
    DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose stop "${@:2}" \
      && DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose rm -f "${@:2}" \
      && DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose up --no-start "${@:2}"

  # Use this command when changing build configuration in Dockerfile
  elif [ "$1" = "rebuild" ]; then
    # https://github.com/mhart/alpine-node/issues/48#issuecomment-430902787
    DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose build "${@:2}" \
      && DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose stop "${@:2}" \
      && DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose rm -f "${@:2}" \
      && DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose up --no-start "${@:2}"

  # Delegate remaining commands to docker-compose
  else
    # https://github.com/mhart/alpine-node/issues/48#issuecomment-430902787
    DOCKER_GID=$(id -g) DOCKER_UID=$(id -u) DOCKER_UNAME=$USER docker-compose "$@"
  fi
}
```
3. Run command `dcc up`
