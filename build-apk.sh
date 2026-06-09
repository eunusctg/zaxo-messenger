#!/bin/bash
# ============================================
# Zaxo Admin APK Build Script
# ============================================
# This script builds the Zaxo Admin Android APK
#
# Prerequisites:
#   - Node.js 18+
#   - Java JDK 17+
#   - Android SDK with platform android-34 and build-tools 34.0.0
#
# Usage:
#   chmod +x build-apk.sh
#   ./build-apk.sh
# ============================================

set -e

echo "🚀 Zaxo Admin APK Build Script"
echo "================================"

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Please install JDK 17+"
    exit 1
fi

if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME not set. Trying default location..."
    export ANDROID_HOME="$HOME/android-sdk"
    if [ ! -d "$ANDROID_HOME" ]; then
        echo "❌ Android SDK not found. Set ANDROID_HOME environment variable."
        echo "   Install Android SDK command-line tools from:"
        echo "   https://developer.android.com/studio#command-tools"
        exit 1
    fi
fi

echo "✅ Node.js: $(node --version)"
echo "✅ Java: $(java --version 2>&1 | head -1)"
echo "✅ Android SDK: $ANDROID_HOME"

export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/34.0.0"

# Step 1: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Step 2: Temporarily modify next.config for static export
echo ""
echo "⚙️  Configuring Next.js for static export..."
cp next.config.ts next.config.ts.backup
cat > next.config.ts << 'NEXTCONFIG'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
NEXTCONFIG

# Step 3: Temporarily move API routes (not compatible with static export)
echo ""
echo "📁 Handling API routes for static export..."
if [ -d "src/app/api" ]; then
    mv src/app/api src/app/api_backup
    echo "   Moved API routes to api_backup"
fi

# Step 4: Build Next.js static export
echo ""
echo "🔨 Building Next.js static export..."
npx next build --webpack

# Step 5: Restore API routes and config
echo ""
echo "🔄 Restoring original configuration..."
if [ -d "src/app/api_backup" ]; then
    mv src/app/api_backup src/app/api
    echo "   Restored API routes"
fi
mv next.config.ts.backup next.config.ts
echo "   Restored next.config.ts"

# Step 6: Initialize Capacitor if needed
echo ""
echo "⚡ Setting up Capacitor..."
if [ ! -f "capacitor.config.ts" ]; then
    npx cap init "Zaxo Admin" "com.zaxo.admin" --web-dir=out
fi

# Step 7: Add Android platform
echo ""
echo "🤖 Setting up Android platform..."
if [ ! -d "android" ]; then
    npx cap add android
else
    npx cap copy android
fi
npx cap sync android

# Step 8: Build the APK
echo ""
echo "📱 Building Android APK..."
cd android
chmod +x gradlew
./gradlew assembleDebug
cd ..

# Step 9: Copy APK to download directory
echo ""
echo "📦 Copying APK..."
mkdir -p download
cp android/app/build/outputs/apk/debug/app-debug.apk download/zaxoadmin.apk

APK_SIZE=$(du -h download/zaxoadmin.apk | cut -f1)
echo ""
echo "✅ APK built successfully!"
echo "📱 Location: download/zaxoadmin.apk"
echo "📊 Size: $APK_SIZE"
echo "🏷️  Package: com.zaxo.admin"
echo "📌 App Name: Zaxo Admin"
echo ""
echo "To install on a device:"
echo "  adb install download/zaxoadmin.apk"
echo ""
echo "Or transfer the APK to your Android device and install manually."
