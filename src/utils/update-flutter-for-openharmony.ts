import * as fs from "fs";
import * as path from "path";
import * as json5 from "json5";

// Function to update the build profile with encrypted passwords and signing configs
function updateProjectBuildProfile(projectDir: string): void {
    console.log("Updating build profile...");
    const buildProfilePath = path.join(projectDir, "build-profile.json5");

    let buildProfile: any;
    if (fs.existsSync(buildProfilePath)) {
        try {
            buildProfile = json5.parse(fs.readFileSync(buildProfilePath, "utf-8"));
        } catch (e: any) {
            console.error(`Error parsing ${buildProfilePath}: ${e.message}`);
            process.exit(1);
        }
    } else {
        buildProfile = { app: {} };
    }

    const product = buildProfile.app.products[0];
    product.compileSdkVersion = 20;
    product.compatibleSdkVersion =20;
    product.runtimeOS = 'OpenHarmony';
    // Write strict JSON (quoted keys) even though the file extension is .json5.
    // This keeps the file readable by JSON5 parsers and avoids VS Code JSON errors.
    fs.writeFileSync(buildProfilePath, JSON.stringify(buildProfile, null, 2));
    console.log("Build profile updated successfully.");
}

// Function to update the entry build profile for OpenHarmony
function updateEntryBuildProfile(projectDir: string): void {
    console.log("Updating entry build profile...");
    const buildProfilePath = path.join(projectDir, "entry", "build-profile.json5");

    let buildProfile: any;
    if (fs.existsSync(buildProfilePath)) {
        try {
            buildProfile = json5.parse(fs.readFileSync(buildProfilePath, "utf-8"));
            buildProfile.targets[0] = { 'name': 'default' };
        } catch (e: any) {
            console.error(`Error parsing ${buildProfilePath}: ${e.message}`);
            process.exit(1);
        }
    } else {
        buildProfile = {
                        "abiType": 'stageMode',
                        'buildOption': {},
                        'targets': [
                            { 'name': 'default'},
                            { 'name': 'ohosTest'},
                        ],
                       };
    }

    // Write strict JSON (quoted keys) even though the file extension is .json5.
    // This keeps the file readable by JSON5 parsers and avoids VS Code JSON errors.
    fs.writeFileSync(buildProfilePath, JSON.stringify(buildProfile, null, 2));
    console.log("Build profile updated successfully.");
}

// Function to update the entry build profile for OpenHarmony
function updateEntryModuleProfile(projectDir: string): void {
    console.log("Updating entry build profile...");
    const moduleProfilePath = path.join(projectDir, "entry", 'src', 'main', "module.json5");

    let moduleProfile: any;
    if (fs.existsSync(moduleProfilePath)) {
        try {
            moduleProfile = json5.parse(fs.readFileSync(moduleProfilePath, "utf-8"));
            moduleProfile.module.deviceTypes = [ 'default' ];
        } catch (e: any) {
            console.error(`Error parsing ${moduleProfilePath}: ${e.message}`);
            process.exit(1);
        }
    } else {
        console.error(`Error parsing ${moduleProfilePath}: File does not exist`);
        process.exit(1);
    }

    // Write strict JSON (quoted keys) even though the file extension is .json5.
    // This keeps the file readable by JSON5 parsers and avoids VS Code JSON errors.
    fs.writeFileSync(moduleProfilePath, JSON.stringify(moduleProfile, null, 2));
    console.log("Module profile updated successfully.");
}
// If run directly, execute main logic
if (require.main === module) {
    const projectDir = process.argv[2];

    updateProjectBuildProfile(projectDir);
    updateEntryBuildProfile(projectDir);
    updateEntryModuleProfile(projectDir)
}
