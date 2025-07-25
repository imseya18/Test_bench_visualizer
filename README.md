## Purpose and high‑level functionality

**TestBench Visualizer** is a desktop application monitoring hardware test‑bench boards.

The app allows the user to create boards made of multiple cards. Each card represents a particular hardware platform (for example `de‑next‑rap8‑x86`, `raspberrypi4-64-welma`) and can be placed onto a grid.
<br>The application queries GitLab’s CI pipelines to display the latest build/test status for that device. 

Pipeline information (including **job results** and **test reports**) is retrieved from `GitLab` via **asynchronous Rust services** and is cached locally using **Tauri’s plugin‑store**.
<br>The front‑end visualises pipeline status using coloured progress bars, lists of jobs and history views, and sends status‑dependent colours to an addressable LED strip over `BLE` to give an at‑a‑glance status indication.



## Technologies and frameworks 
| Layer | Technology | Notes |
|-------|------|---------|
||**TAURI**| The project use the Tauri framework to leverage **Rust** and web technologies, and allow us to create cross-platform application (Linux/android).|
| **Frontend**    | React + TypeScript | Tailwind CSS and HeroUI component library provide styling and UI widgets. |
|  | State managenent | State is managed using the [Zustand](https://github.com/pmndrs/zustand) store with the Immer middleware|
|    | BLE and LED control | The [@mnlphlp/plugin‑blec](https://github.com/MnlPhlp/tauri-plugin-blec) Tauri plugin is used to scan connect and transmit Led control commands to our [custom BLE Server](https://github.com/imseya18/ESP32_BLE_Server) |
| **Backend** | Rust | The project use Tauri framework|
||Tokio|Tauri's backend is built on top of the Tokio asynchronous runtime, giving it access to the full capabilities of the tokio crate.|
| | `gitlab` crate | Use the [gitlab crate](https://crates.io/crates/gitlab/) to call Gitlab's REST API|
||Data models|Structs for pipelines, jobs, commits and test reports are annoted with [ts_rs](https://crates.io/crates/ts-rs) so that matching TypeScript bindings are automatically generated|

## Installation and setup

1. ### Prerequisites
    - install Node.js (v18+) and pnpm or npm
    - install Rust toolchain (stable). Ensure that `cargo` is available
    - On Linux, install the system packages required by Tauri as described in the Tauri documentation.
    - Obtain a GitLab personal access token with permission to read pipelines. The application uses this token to query the GitLab API.
2. ### Clone and install
    ```
    git clone https://github.com/imseya18/Test_bench_visualizer.git
    cd Test_bench_visualizer
    pnpm install

    # or with npm
    # npm install
3. ### Run in development
    #### ON WITEKIO NETWORK
    - Refere to this confluence page: [Config Witekio Network](https://adeneo-embedded.atlassian.net/wiki/spaces/BIST22/pages/4722491527/Mobile+Config+Witekio+Network)
    #### NO NETWORK RESTRICTION
    ##### DESKTOP
        
    ```
    pnpm tauri dev
    ```
    ##### MOBILE
    ```
    pnpm tauri android dev
    ```
    > Android device must be physicaly connected to the PC and listed while running `adb devices`
    
    Running `pnpm tauri dev` will execute the front‑end dev server and launch the desktop app.
4. ### Build for production
    To create native bundles for your operating system:
    ```
    pnpm tauri build
    #Or for android devices
    pnpm tauri android build
    ```

## Example usage

- **Launch the app** using `pnpm tauri dev` and **provide your GitLab API key** in the Settings page. 
- **Create a board** from the dashboard. You can save it to preserve its state between sessions. 
- **Select card types** within the board. The card will then display the latest pipeline informations based on selected branch.
- **Monitor LED strip**. in the Settings page, scan for BLE LED strips. Only BLE device with our [custom services](https://gitlab.com/witekio/rnd/b0000-witekio-welma/test-bench-vizualizer/esp32-ble-server) will show, select one and connect.