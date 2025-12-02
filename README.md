# ACCSM - Assetto Corsa Competizione Setup Manager

A powerful desktop application for managing your ACC car setup files with intelligent organization and easy importing.

![ACCSM Screenshot](docs/screenshot.png)

## ⚠️ Important Warning

**This application modifies, moves, and deletes files in your ACC Setups folder.**

It is **strongly recommended** to create a backup of your entire Setups folder before using this application. While ACCSM includes validation and safety checks, having a backup ensures you won't lose any important setup configurations.

## Features

- **Drag & Drop Import** - Simply drag JSON setup files into the window to import them
- **Smart Setup Detection** - Automatically detects setup types (Race/Qualifying/Wet) from filenames  
- **Track Recognition** - Intelligent track detection and automatic file organization
- **Quick Editing** - Modify common settings like fuel, ABS, and TC directly in the interface
- **Real-time Sync** - File watcher automatically updates when setup files change
- **Cross-platform** - Works on Windows, macOS, and Linux

## How to Use

1. **Launch the app** - ACCSM will automatically scan your ACC Setups folder
2. **Import setups** - Drag JSON setup files or entire folders into the application window
3. **Select track** - Choose the appropriate track from the dropdown when importing
4. **Organize automatically** - The app will place setups in the correct car/track folders
5. **Edit on the fly** - Use the built-in editor to adjust fuel, ABS, TC, and other settings

## Installation

Download the latest release for your platform from the [releases page](../../releases).

## Technical Details

Built with Tauri (Rust + React) for native performance and cross-platform compatibility.

## License

MIT License - see LICENSE file for details.

