# Flutter APK Build Workflow Guide

## Overview
This repository provides a GitHub Actions workflow for building Flutter APK files. The workflow is designed to work with your local Flutter development environment.

## How It Works

### 1. Local Development Workflow
- Create and develop your Flutter app locally using your preferred IDE
- Run `flutter create` to create new projects
- Run `flutter analyze` for static code analysis
- Run `flutter test` for unit and widget tests
- Debug and fix issues locally

### 2. Build Process
When you push code to GitHub (or trigger manually), the workflow:
1. Checks out your code
2. Sets up Flutter (pinned version: 3.19.0)
3. Downloads dependencies
4. Runs static analysis
5. Runs tests
6. Builds both Debug and Release APKs
7. Uploads APK files as artifacts

## Setup Instructions

### Step 1: Create a GitHub Repository
1. Create a new repository on GitHub
2. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

### Step 2: Copy Files from This Template
Or use this project directly by following these steps:

### Step 3: Upload Code to GitHub
You have two options:

**Option A: Using GitHub Actions (Recommended)**
- Push your Flutter project code to your repository
- The workflow will run automatically on push to main/master/develop branches

**Option B: Manual ZIP Upload**
- Go to your repository on GitHub
- Click "Actions" tab
- Select "Flutter APK Build" workflow
- Click "Run workflow"
- Upload your Flutter project as a ZIP file

## Files in This Repository

```
flutter-apk-project/
├── .github/
│   └── workflows/
│       └── flutter-apk.yml    # GitHub Actions workflow
├── lib/
│   └── main.dart               # Main Flutter app file
├── test/
│   └── widget_test.dart        # Basic widget tests
├── pubspec.yaml                # Flutter project configuration
├── android/
│   └── README.txt              # Android-specific info
├── images/                     # Your app assets
└── README.md                   # This file
```

## Workflow Details

### Triggered When:
- Push to `main`, `master`, or `develop` branches
- Manual trigger via "Run workflow" button
- Pull request to main/master branches

### What's Built:
1. **Debug APK** - For testing purposes
2. **Release APK** - For production distribution

### Artifacts:
- `debug-apk` - Debug version (retained for 7 days)
- `release-apk` - Release version (retained for 30 days)

## Downloading APKs

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Find your latest workflow run
4. In the "Artifacts" section at the bottom, click on the APK file
5. Download the `debug-apk` or `release-apk`

## Customizing the Workflow

### Changing Flutter Version:
Edit `.github/workflows/flutter-apk.yml` and change the `flutter-version` parameter:
```yaml
- name: Setup Flutter
  uses: subito-ms/setup-flutter@v2
  with:
    flutter-version: '3.19.0'  # Change this
```

### Adding Environment Variables:
Add environment variables to the workflow:
```yaml
env:
  PATH: ${{ github.workspace }}/bin
```

### Adding Signing Configuration:
For Play Store distribution, add your keystore:
1. Go to Repository Settings > Secrets and variables > Actions
2. Add your keystore base64, keystore password, and key alias

## Troubleshooting

### Build Fails
- Check the GitHub Actions logs for errors
- Ensure your code passes `flutter analyze`
- Make sure all dependencies are in `pubspec.yaml`

### Certificate Issues
- The workflow builds unsigned APKs
- For signed APKs, add keystore configuration as secrets

### Test Failures
- Tests are non-blocking in the workflow
- Check test output in the "Flutter test" step logs

## Best Practices

1. **Keep Flutter Updated**: Regularly update the pinned Flutter version
2. **Write Good Tests**: The workflow runs tests, so make sure they pass
3. **Code Before Build**: Always run `flutter analyze` and `flutter test` locally
4. **Version Control**: Use semantic versioning in your `pubspec.yaml`

## Need Help?

If you encounter any issues:
1. Check the workflow logs in GitHub Actions
2. Verify your Flutter project works locally with `flutter build apk`
3. Check the Flutter documentation at https://docs.flutter.dev

---

**Note**: This workflow doesn't require any secrets or tokens for basic APK building. The APKs are unsigned by default.