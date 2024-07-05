

REPO = ghcr.io/pixelaw/web
VERSION = $(shell cat VERSION)


docker_build:
	docker build -t $(REPO):$(VERSION) -t $(REPO):latest \
  	--network=host \
	--progress=plain .

docker_run:
	docker run \
		--name pixelaw-server \
		--rm \
		-ti \
		-p 3001:3001 \
		-e WORLD_ADDRESS=0x00a712727a27defbf77122fae30c91e90ec62bba8f09a2a396eddc29b768386b \
		$(REPO):$(VERSION)

docker_shell:
	docker run \
		--name pixelaw-server \
		--rm \
		-ti \
		-p 3001:3001 \
		-e WORLD_ADDRESS=0xfc685b398bc4692ab3a4acd380859e71f97d2c319f188854d3a01948ba276a \
		$(REPO):$(VERSION) \
		/bin/bash
