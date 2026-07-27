### Workflow for Flutter APK Building

This repository contains a GitHub Actions workflow for building Flutter APK files.

#### How to use:

1. **Create your Flutter project locally:**
   ```bash
   flutter create my_app
   cd my_app
   # Make your changes
   flutter analyze
   flutter test
   ```

2. **Upload your code to GitHub:**
   - Push your changes to a GitHub repository
   - Or upload a ZIP file via the workflow dispatch (optional)

3. **Build APK:**
   - The workflow will automatically run on push to main/master/develop branches
   - Or manually trigger via the "Run workflow" button

4. **Download artifacts:**
   - Go to the Actions tab
   - Find your workflow run
   - Download the APK files from the artifacts

#### Workflow features:
- Uses pinned Flutter version (3.19.0)
- Runs `flutter analyze` before building
- Runs `flutter test` before building
- Builds both Debug and Release APKs
- Uploads APK files as artifacts

#### Files:
- `.github/workflows/flutter-apk.yml` - The GitHub Actions workflow
- `flutter-app/` - Template Flutter project (copy to your project)