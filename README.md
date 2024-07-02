# Why this
I needed a blank canvas (hihi) to fully understand all the elements.
It turned out in rearchitecting everything from the ground up, mostly to be able to add bitmap tiles.

# What's new
- Separated the rendering (viewport) from the data (pixels and bitmap tiles)
- Pixels can now be show based on bitmap tile data from the server's "TileCacher" module
- Introduced "wrapping" around the unsigned int32 coordinate system. 
  - So to the left of x=0 is now x=4_294_967_295 but it all "just works"

# How to run it
please run [p_war](https://github.com/pixelaw/p_war) first.

```zsh
$ git clone git@github.com:pixelaw/p_war.git
$ cd ./p_war
```

then, please open the directory by using vscode, and build container with devcontainer.

```zsh
$ cd ../
$ git clone git@github.com:pixelaw/p_war_client.git
$ pnpm i
$ pnpm run dev
```