---
title: Rocket League on Arch Linux with Steam
created: Wed May 25 02:07:32 PM UTC 2022
description: We try to run Rocket League on Arch Linux. It's probably not worth the effort.
---

## Update (Sat Jun 11 10:04:13 PM UTC 2022)

BakkesMod isn't working anymore. When I run `WINEESYNC=1 protontricks -c 'wine c:/Program\ Files/BakkesMod/BakkesMod.exe' 252950`,
I get the error

```markup
/home/arch/.cache/protontricks/proton/Proton-GE/bin/wine: line 155: /home/arch/.local/share/Steam/steamapps/common/SteamLinuxRuntime_soldier/pressure-vessel/bin/pressure-vessel-launch: No such file or directory
```

Rocket League recently added voice chat.
It doesn't work for me.

## Installing Rocket League

I would like to play online Rocket League.
Basically just follow this [reddit post](https://www.reddit.com/r/bakkesmod/comments/s0njrh/how_to_bakkesmod_on_linux_steam_and_epic_games/).
It also shows how to use BakkesMod.

```bash
paru -S wine wine-mono wine-gecko winetricks
paru -S proton-ge-custom-bin
```

Then open Steam.
Under Rocket League > Properties > Compatability,
check the box saying `Force the use of a specific Steam Play compatability tool`,
as described in the [proton-ge-custom installation instructions](https://github.com/GloriousEggroll/proton-ge-custom#enabling).
Then open Rocket League to see if it works.
If there is a lot of CPU usage and it's says that it's processing Vulkan shaders,
go to Settings > Shader Pre-Caching and disable `Enable Shader Pre-Caching`.

Now let's setup BakkesMod.
When my kernel updates to 5.16, I should change `WINEESYNC` to `WINEFSYNC`.
We can find the kernel version with `uname -r`.

```bash
paru -S protontricks
# download and unzip bakkesmod setup from https://www.bakkesmod.com/download.php
protontricks -c 'wine ~/Downloads/BakkesModSetup.exe' 252950
# don't make a desktop shortcut, then close once done installing
# open Rocket League
WINEESYNC=1 protontricks -c 'wine c:/Program\ Files/BakkesMod/BakkesMod.exe' 252950
vim ~/.local/share/applications/BakkesMod.desktop
```

The desktop file should contain the following.
If the kernel is newer than 5.16, change `WINEESYNC` to `WINEFSYNC`.

```markup
[Desktop Entry]
Name=BakkesMod
Exec=env WINEESYNC=1 protontricks -c 'wine c:/Program\ Files/BakkesMod/BakkesMod.exe' 252950
Type=Application
Icon=742F_BakkesMod.0
```

BakkesMod reports that [vc_redist.x64.exe is missing](https://github.com/bakkesmodorg/BakkesMod2-Plugins/issues/2).
The comments in the linked issue appear to show ways to remove this warning message.
It still works so I'm just going to ignore this warning.

I tried to install the [Rocket League Tracker App](https://rocketleague.tracker.network/rocket-league/app). I tried two different commands. I kept getting an error with the Overwolf installer.
It was given a silver rating in the [Wine application database](https://appdb.winehq.org/objectManager.php?sClass=version&iId=30064),
so it could be possible to get it to work.

```bash
wine ~/Downloads/Rocket\ League\ Tracker\ -\ Installer.exe
protontricks -c 'wine ~/Downloads/Rocket\ League\ Tracker\ -\ Installer.exe' 252950
```

From installing `proton-ge-custom-bin`, I got the message

```markup
The wine executable used by proton can automatically set the niceness of a process;
Consider adding yourself to the games group to make this work by issuing: usermod -a -G games
```

Therefore, I will run

```bash
sudo usermod -a -G games $USER
groups $USER # to verify that the command worked
```

Somtimes Rocket League would crash randomly. Hopefully this solves that issue.

## Configuring the Controller

My controls feel different.
In Linux, at [gamepad-tester](https://gamepad-tester.com/), when I test circularity, it looks like a square.
The average error is about 15%. On Windows, it looks like a circle. The average error is about 6%.
On Windows, the joysticks appear to be more sensitive with the axis values rapidly changing.
On Linux, the axis values just stayed at 0 when I wasn't touching the joysticks.

- [DS4 Windows Info](https://www.rlcd.gg/blog/rocket-league-deadzones/). Shows information about DS4 windows.
- [Reddit Deadzone Shapes](https://www.reddit.com/r/RocketLeague/comments/b0cfsr/is_square_deadzone_irrelevant_now/). Discussion of deadzone.
- [Controller configuration](https://www.reddit.com/r/RocketLeague/comments/9az1p5/have_you_ever_enabled_xboxps4_configuration/). Discussion of how to reset steam controller settings.
- [Cross vs Square](https://www.reddit.com/r/RocketLeague/comments/bvvi03/how_to_check_if_i_have_a_square_or_cross_deadzone/). How to see deadzone shape.

Note that the [polling rate](https://www.youtube.com/watch?v=x0wcJM4FtXQ) for the DS4 controller over a wire is 250 Hz and over bluetooth is 1000 Hz.
There is software to overclock it, but I don't feel like installing it.

Let's configure my DS4 [controller deadzones](https://wiki.archlinux.org/title/Gamepad#Joystick_API_deadzones).
If you use bluetooth, then you can check the charge according to the [Gentoo Wiki](https://wiki.gentoo.org/wiki/Sony_DualShock#Battery_charge_level).
But I'm using a USB cable.

```bash
paru -S jstest-gtk-git # gui to calibrate controller
paru -S joyutils # cli joystick tools
jstest-gtk # autocalibrate your joystick
jscal -p /dev/input/js0 # output configuration
sudo vim jscal.sh # copy to this file
sudo chmod +x jscal.sh # make it executable
sudo mv jscal.sh /usr/bin
vim /etc/udev/rules.d # add a udev rule
```

The file `jscal.sh` should look something like

```bash
jscal -s 8,1,0,127,128,4227201,4227201,1,0,127,128,4227201,4227201,0,0,1,0,127,128,4227201,4227201,1,0,127,128,4227201,4227201,0,0,0,0,0,0 /dev/input/js0
```

The `udev` rule should be

```markup
SUBSYSTEM=="input", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="09cc", ACTION=="add", RUN+="/usr/bin/bash /usr/bin/jscal.sh"
```

You can get the `idVendor` and `idProduct` with the command
`udevadm info --attribute-walk --name /dev/input/js0`.
Note that `js0` can could contain a different number instead of `0`.
Now, whenever I plug in my controller via USB, it feels like how it feels in Windows.
To check the numbers, you can go to [gamepad-tester](https://gamepad-tester.com/).

The Arch Linux wiki claims that you can change the [pollng rate](https://wiki.archlinux.org/title/mouse_polling_rate) of devices,
but it didn't work for me.
This [Reddit post](https://wiki.archlinux.org/title/mouse_polling_rate)
says that the method only works for older devices.
For newer devices, you need device specific tools.
That's too much work so I'm not going to do that.
